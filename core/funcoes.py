from django import template

register = template.Library()


@register.simple_tag
def get_current_year():
    from datetime import date
    return date.today().year


register = template.Library()
