from django import forms
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.contrib import admin
from django.db.models.signals import post_save, post_migrate
from django.dispatch import receiver
from dateutil.relativedelta import relativedelta
from django.contrib.auth.models import Permission


class Base(models.Model):
    criado = models.DateField('Criação', auto_now_add=True)
    modificado = models.DateField('Atualização', auto_now=True)
    ativo = models.BooleanField('Ativo', default=True)

    class Meta:
        abstract = True


class Despesas(Base):
    DoesNotExist = None
    objects = None
    nome = models.CharField('Nome', max_length=50)
    descricao = models.CharField('Descrição', max_length=255)
    valor = models.DecimalField('Valor', max_digits=10, decimal_places=2)
    vencimento = models.DateField('Vencimento', auto_now_add=False)
    repete = models.BooleanField('Repete', default=False)  # Novo campo para indicar se a despesa se repete
    repeticao = models.PositiveIntegerField('Por quantos meses?', default=0)
    original = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE,
                                 related_name='despesas_mensais')
    paga = models.BooleanField('Paga', default=False)

    class Meta:
        verbose_name = 'Despesa'
        verbose_name_plural = 'Despesas'

    def __str__(self):
        return self.descricao


@receiver(post_save, sender=Despesas)
def criar_despesas_mensais(instance, created, **kwargs):
    if instance.repete and created and instance.repeticao > 0:
        hoje = instance.vencimento

        repeticao_atual = instance.repeticao
        instance.repeticao = 0
        instance.save()

        for _ in range(repeticao_atual):
            hoje += relativedelta(months=1)
            Despesas.objects.create(
                nome=instance.nome,
                descricao=instance.descricao,
                valor=instance.valor,
                vencimento=hoje,
                repete=True,
                repeticao=0
            )
    elif not instance.repete and created:

        pass


class DespesasAdmin(admin.ModelAdmin):
    list_display = ('nome', 'valor', 'vencimento', 'ativo', 'paga', 'descricao')
    list_filter = ('paga',)

    def get_ordering(self, request):
        # Restaurar a ordem padrão quando o filtro 'paga' está ativo
        if 'paga__exact' in request.GET and request.GET['paga__exact'] == '1':
            return '-ativo', 'vencimento'  # Adicione 'ativo' para garantir que os não pagos apareçam primeiro
        return super().get_ordering(request)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(paga=False)


class NovaDespesaForm(forms.ModelForm):
    class Meta:
        model = Despesas
        fields = ['nome', 'descricao', 'valor', 'vencimento', 'repeticao']

    def save(self, commit=True):  # Certifique-se de adicionar o parâmetro 'commit'
        instance = super().save(commit=False)

        if commit:
            instance.save()
        return instance


class Despesa(models.Model):
    # Seus outros campos
    pago = models.BooleanField(default=False)
