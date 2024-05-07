from decimal import Decimal
from django import forms
from .models import Despesas

class NovaDespesaForm(forms.ModelForm):
    class Meta:
        model = Despesas
        fields = ['nome', 'descricao', 'valor', 'vencimento', 'repete', 'repeticao']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['valor'].widget = forms.TextInput(
            attrs={'class': 'form-control', 'oninput': 'replaceCommaWithDot(this)'})

    # Inclua os campos ocultos para garantir que o id seja enviado corretamente
    id = forms.IntegerField(widget=forms.HiddenInput(), required=False)

    # Adicione o campo pago como um BooleanField oculto
    pago = forms.BooleanField(initial=False, widget=forms.HiddenInput(), required=False)

    # Personalize os rótulos dos campos
    labels = {
        'nome': 'Nome da Despesa',
        'valor': 'Valor',
        'vencimento': 'Data de Vencimento',
    }

    # Adicione classes CSS aos campos se necessário
    widgets = {
        'nome': forms.TextInput(attrs={'class': 'form-control'}),
        'valor': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
        'vencimento': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
    }

    def clean_valor(self):
        valor = self.cleaned_data.get('valor')
        # Verifica se o valor é do tipo Decimal
        if isinstance(valor, Decimal):
            # Converte o valor para string antes de verificar a vírgula
            valor_str = str(valor)
            # Substitui a vírgula por ponto
            valor_str = valor_str.replace(',', '.')

            # Converte de volta para Decimal
            valor = Decimal(valor_str)
        return valor

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.valor = self.clean_valor()

        # Configura o valor do campo pago
        instance.pago = self.cleaned_data.get('pago')

        if commit:
            instance.save()
        return instance
