from django import template

register = template.Library()


@register.filter
def dictkey(d, key):
    """Get a value from a dict by key. Usage: {{ mydict|dictkey:key }}"""
    if isinstance(d, dict):
        return d.get(key, [])
    return []


@register.filter
def split(value, sep):
    """Split a string by separator. Usage: {{ "a,b,c"|split:"," }}"""
    if value:
        return str(value).split(sep)
    return []


@register.filter
def mul(value, arg):
    """Multiply a value by arg."""
    try:
        return float(value) * float(arg)
    except (ValueError, TypeError):
        return 0


@register.filter
def sub(value, arg):
    """Subtract arg from value."""
    try:
        return float(value) - float(arg)
    except (ValueError, TypeError):
        return 0
