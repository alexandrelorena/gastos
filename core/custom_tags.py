from django import template
import datetime

from django.db.models import Sum

register = template.Library()


@register.simple_tag
def get_current_date():
    return datetime.datetime.now()


@register.simple_tag
def get_current_year():
    from datetime import date
    return date.today().year


@register.filter
def get_valor_sum(queryset):
    return queryset.aggregate(Sum('valor'))['valor__sum']


@register.simple_tag
def my_custom_tag():
    # Implementação da tag personalizada
    return "Hello, World!"
