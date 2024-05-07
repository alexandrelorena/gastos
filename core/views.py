# Importações do Django
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.db.models import Sum
from django.shortcuts import redirect, get_object_or_404, render
from django.urls import reverse_lazy, reverse
from django.views import View
from django.views.generic import ListView, TemplateView
from django.http import HttpResponseRedirect, HttpResponseBadRequest, JsonResponse
from django.utils.text import capfirst
from django import forms
from .models import Despesas

# Outras importações
from dateutil.relativedelta import relativedelta
from rest_framework import viewsets

# Importações do seu aplicativo
from .serializers import DespesaSerializer
from datetime import date
from .forms import NovaDespesaForm


def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('index')  # Redirecione para a página inicial após o login
    else:
        form = AuthenticationForm(request)
    return render(request, 'login.html', {'form': form})


def deletar_despesa(request, pk):
    despesa = get_object_or_404(Despesas, pk=pk)

    despesa.delete()

    return redirect('index')


def editar_despesa(request, pk):
    despesa = get_object_or_404(Despesas, pk=pk)

    if request.method == 'POST':
        form = DespesaForm(request.POST, instance=despesa)
        if form.is_valid():
            form.save()
            # Redireciona para a visualização que mostra todas as despesas do mês
            return redirect('mes', nome_mes=despesa.get_nome_mes_display().lower())
    else:
        form = DespesaForm(instance=despesa)

    return render(request, 'editar_despesa.html', {'form': form, 'despesa': despesa})


class UpdateDespesaView(View):
    template_name = 'editar_despesa.html'

    def get(self, request, pk, *args, **kwargs):
        despesa = get_object_or_404(Despesas, pk=pk)
        form = DespesaForm(instance=despesa)
        return render(request, self.template_name, {'form': form, 'despesa': despesa})

    def post(self, request, pk, *args, **kwargs):
        despesa = get_object_or_404(Despesas, pk=pk)
        form = DespesaForm(request.POST, instance=despesa)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse_lazy('index'))

        return render(request, self.template_name, {'form': form, 'despesa': despesa})


class DespesaForm(forms.ModelForm):
    class Meta:
        model = Despesas
        fields = ['nome', 'valor', 'vencimento']

    # Incluindo os campos ocultos para garantir que o id seja enviado corretamente.
    id = forms.IntegerField(widget=forms.HiddenInput(), required=False)


def listar_despesas(request):
    despesas = Despesas.objects.all()
    return render(request, 'listar_despesas.html', {'despesas': despesas})


class DespesaViewSet(viewsets.ModelViewSet):
    queryset = Despesas.objects.all()
    serializer_class = DespesaSerializer

    # def __init__(self, **kwargs):
    #     super().__init__(kwargs)
    #     self.POST = None
    #     self.method = None


# @login_required  LoginRequiredMixin,
class IndexView(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, nome_mes=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['nome_mes'] = self.request.GET.get('nome_mes', '')

        numero_mes = MESES_DICT.get(nome_mes)

        if numero_mes is not None:
            despesas_do_mes = Despesas.objects.filter(vencimento__month=numero_mes).order_by('vencimento')
            total_despesas = despesas_do_mes.aggregate(Sum('valor'))['valor__sum'] or 0

            context['mes'] = nome_mes.title()
            context['despesas_do_mes'] = despesas_do_mes
            context['hoje'] = date.today()
            context['total_despesas'] = total_despesas
        else:
            context['mes'] = nome_mes
            context['despesas_do_mes'] = []

        return context


MESES_DICT = {
    'janeiro': 1,
    'fevereiro': 2,
    'março': 3,
    'abril': 4,
    'maio': 5,
    'junho': 6,
    'julho': 7,
    'agosto': 8,
    'setembro': 9,
    'outubro': 10,
    'novembro': 11,
    'dezembro': 12,
    'jan': 1,
    'fev': 2,
    'mar': 3,
    'abr': 4,
    'mai': 5,
    'jun': 6,
    'jul': 7,
    'ago': 8,
    'set': 9,
    'out': 10,
    'nov': 11,
    'dez': 12
}


class AdicionarDespesaView(View):
    template_name = 'adicionar_despesa.html'

    def get(self, request, *args, **kwargs):
        limite_repeticoes = 11  # Defina o valor correto aqui
        form = NovaDespesaForm()
        return render(request, self.template_name, {'form': form, 'limite_repeticoes': limite_repeticoes})

    def post(self, request, nova_despesa=None, limite_repeticoes=None, *args, **kwargs):
        form = NovaDespesaForm(request.POST)

        if form.is_valid():
            nova_despesa = form.save(commit=False)
            nova_despesa.save()

            # Adiciona despesa aos outros meses, se necessário
            if nova_despesa.repeticao > 0:
                hoje = nova_despesa.vencimento
                for _ in range(nova_despesa.repeticao):
                    hoje += relativedelta(months=1)
                    # Ajuste para evitar duplicação
                    Despesas.objects.get_or_create(
                        nome=nova_despesa.nome,
                        descricao=nova_despesa.descricao,
                        valor=nova_despesa.valor,
                        vencimento=hoje,
                        # repete=True,
                        repeticao=0,  # Reinicia o número de meses para evitar criação adicional

                    )

            return redirect('index')

        return render(request, self.template_name, {'form': form, 'despesas': nova_despesa, 'limite_repeticoes': limite_repeticoes})


class DespesaActionsView(View):
    @staticmethod
    def incluir_nova_despesa(request):
        nome_despesa = request.POST.get('nome')
        descricao_despesa = request.POST.get('descricao')
        valor_despesa = request.POST.get('valor')
        vencimento_despesa = request.POST.get('vencimento')
        repete_despesa = 'repete' in request.POST
        request.POST.get('repeticao')

        Despesas.objects.create(
            nome=nome_despesa,
            descricao=descricao_despesa,
            valor=valor_despesa,
            vencimento=vencimento_despesa,
            repete=repete_despesa,
            repeticao=0  # Reinicia o número de meses para evitar criação adicional
        )
        return HttpResponseRedirect(reverse_lazy('index'))

    @staticmethod
    def marcar_despesa_como_paga(request):
        despesa_id = request.POST.get('despesa_id')
        despesa = get_object_or_404(Despesas, pk=despesa_id)
        despesa.paga = True
        despesa.save()
        return HttpResponseRedirect(reverse('despesas'))

    @staticmethod
    def post(request, *args, **kwargs):
        action = request.POST.get('action')

        if action == 'marcar_paga':
            return DespesaActionsView.marcar_despesa_como_paga(request)
        elif action == 'adicionar_despesa':
            return DespesaActionsView.incluir_nova_despesa(request)
        else:
            return HttpResponseBadRequest("Ação desconhecida")


class BaseDespesaView(ListView):
    template_name = 'adicionar_despesa.html'
    model = Despesas
    context_object_name = 'despesas'

    # def get_queryset(self):
    #     # ... seu código para filtrar despesas do mês ...
    #     ano_atual = date.today().year
    #     queryset = super().get_queryset()  # Remove 'context' da chamada super()
    #     contexto = {'ano_atual': ano_atual}  # Atribui a uma variável separada
    #     return queryset, contexto


class ListaDespesasView(BaseDespesaView):
    pass


class DespesaMensalView(BaseDespesaView):
    pass


class MesView(TemplateView):
    template_name = 'mes.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        nome_mes = kwargs['nome_mes'].lower()
        numero_mes = MESES_DICT.get(nome_mes)
        status = self.request.GET.get('status', None)

        if numero_mes is not None:
            despesas_do_mes = Despesas.objects.filter(vencimento__month=numero_mes).order_by('vencimento')

            if status == 'paga':
                despesas_do_mes = despesas_do_mes.filter(paga=True)
            elif status == 'atrasada':
                despesas_do_mes = [despesa for despesa in despesas_do_mes if
                                   despesa.vencimento < date.today() and not despesa.paga]
            elif status == 'a_vencer':
                despesas_do_mes = [despesa for despesa in despesas_do_mes if
                                   despesa.vencimento > date.today() and not despesa.paga]

            total_despesas = despesas_do_mes.aggregate(Sum('valor'))['valor__sum'] or 0

            context['mes'] = nome_mes.title()
            context['despesas_do_mes'] = despesas_do_mes
            context['hoje'] = date.today()
            context['total_despesas'] = total_despesas
            context['status_filter'] = status  # Adiciona o status atual ao contexto

        else:
            context['mes'] = nome_mes
            context['despesas_do_mes'] = []

        return context

    def post(self, request, **kwargs):
        nome_mes = kwargs['nome_mes'].lower()
        numero_mes = MESES_DICT.get(nome_mes)

        if numero_mes is not None:
            despesas_do_mes = Despesas.objects.filter(vencimento__month=numero_mes).order_by('vencimento')
            context = {
                'mes': nome_mes.title(),
                'despesas_do_mes': despesas_do_mes,
                'hoje': date.today(),
            }

            if 'despesa_id' in request.POST:
                despesa_id = request.POST['despesa_id']
                despesa = get_object_or_404(Despesas, pk=despesa_id)
                despesa.paga = True
                despesa.save()

        else:
            context = {
                'mes': nome_mes,
                'despesas_do_mes': [],
            }

        return self.render_to_response(context)


class ConteudoView(TemplateView):
    template_name = 'conteudo.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        nome_mes = kwargs['nome_mes'].title()
        context['nome_mes'] = nome_mes
        return context


class HeaderView(TemplateView):
    template_name = 'header.html'
    meses = MESES_DICT
    context_object_name = 'meses'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        nome_mes = self.request.GET.get('nome_mes', '').lower()
        context['nome_mes'] = capfirst(nome_mes)
        return context


# class DespesaView:
#     @classmethod
#     def as_view(cls):
#         pass


class DespesaPagaView(View):
    """
    View para marcar uma despesa como paga.
    """

    def post(self, request, *args, **kwargs):
        """
        Manipula requisições POST para marcar uma despesa como paga.

        Args:
            request: Objeto de requisição HTTP.

        Returns:
            JsonResponse: Retorna uma resposta JSON indicando o sucesso da operação.
            :param request:
            :param args:
            :param kwargs:
            :return:
        """
        despesa_id = request.POST.get('despesa.id')
        despesa = get_object_or_404(Despesas, pk=despesa_id)
        despesa.paga = True
        despesa.save()
        return JsonResponse({'status': 'success', 'message': 'Despesa marcada como paga'})
