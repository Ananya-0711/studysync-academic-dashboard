from django.contrib import admin
from .models import Subject, TimetableSlot

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'credits', 'user']
    list_filter = ['user']

@admin.register(TimetableSlot)
class TimetableSlotAdmin(admin.ModelAdmin):
    list_display = ['day', 'start_time', 'subject', 'user']
    list_filter = ['user', 'day']
