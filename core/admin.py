from django.contrib import admin
from .models import Despesas


@admin.register(Despesas)
class DespesasAdmin(admin.ModelAdmin):
    list_display = ('nome', 'descricao', 'valor', 'vencimento', 'ativo', 'paga')