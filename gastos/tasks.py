# gastos/tasks.py

from celery import shared_task
from datetime import date, timedelta
from core.models import Despesa

@shared_task
def atualizar_status_despesas():
    hoje = date.today()
    despesas_vencidas = Despesa.objects.filter(vencimento__lt=hoje, status='Pendente')

    for despesa in despesas_vencidas:
        despesa.status = 'Vencida'
        despesa.save()
