import os
from pathlib import Path
import environ
from celery.schedules import crontab

BASE_DIR = Path(__file__).resolve().parent.parent

# Inicialize o django-environ
env = environ.Env(
    DEBUG=(bool, False)
)

# Leia a variável de ambiente DJANGO_ENV diretamente
django_env = os.getenv('DJANGO_ENV')
print(f"DJANGO_ENV: {django_env}")

# Determine qual arquivo .env carregar com base no DJANGO_ENV
env_file = '.env.production' if django_env == 'production' else '.env.development'

# Leia o arquivo .env apropriado
environ.Env.read_env(os.path.join(BASE_DIR, env_file))
print(f"DJANGO_ENV: {env('DJANGO_ENV')}")

# Configurações
SECRET_KEY = env('SECRET_KEY')
DEBUG = env.bool('DEBUG')
ALLOWED_HOSTS = ['*'] if DEBUG else ['gastos-production.up.railway.app', 'www.gastos-production.up.railway.app']

# Application definition

INSTALLED_APPS = [
    'core',
    'rest_framework',
    'bootstrap4',
    'corsheaders',
    'django_celery_beat',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "gastos.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": ['templates'],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "gastos.wsgi.application"

# Configuração do banco de dados
if django_env == 'production':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': env('DATABASE_NAME'),
            'USER': env('DATABASE_USER'),
            'PASSWORD': env('DATABASE_PASSWORD'),
            'HOST': env('DATABASE_HOST'),
            'PORT': env('DATABASE_PORT'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': env('DATABASE_NAME'),
            'USER': env('DATABASE_USER'),
            'PASSWORD': env('DATABASE_PASSWORD'),
            'HOST': env('DATABASE_HOST'),
            'PORT': env('DATABASE_PORT'),
        }
    }

CSRF_TRUSTED_ORIGINS = [
    'https://gastos-production.up.railway.app',
]

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:8000",
    "https://gastos-production.up.railway.app",
]

LOGIN_URL = 'login_view'
LOGIN_REDIRECT_URL = 'index'

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
MEDIA_URL = '/media/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {'console': {'class': 'logging.StreamHandler'}},
    'root': {'handlers': ['console'], 'level': 'DEBUG'},
}

# Configurações do Celery
if django_env == 'production':
    CELERY_BROKER_URL = env('REDIS_URL')
    CELERY_RESULT_BACKEND = env('REDIS_URL')
else:
    CELERY_BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
    
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

CELERY_BEAT_SCHEDULE = {
    'atualizar-status-despesas': {
        'task': 'seu_projeto.tasks.atualizar_status_despesas',
        'schedule': crontab(hour='0', minute='0'),
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
