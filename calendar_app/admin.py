from django.contrib import admin
from .models import CalendarEvent

@admin.register(CalendarEvent)
class CalendarEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'date', 'time', 'location', 'user']
    list_filter = ['user', 'event_type', 'date']
    date_hierarchy = 'date'
