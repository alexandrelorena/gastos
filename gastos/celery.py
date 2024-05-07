# celery.py

from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Configurações do Django para o Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gastos.settings')

# Crie uma instância do Celery
app = Celery('gastos')

# Carregue as configurações do Django no Celery
app.config_from_object('django.conf:settings', namespace='CELERY')

# Descubra tarefas em aplicativos Django
app.autodiscover_tasks()
