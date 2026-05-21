from django.contrib import admin
from .models import Assignment

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'due_date', 'status', 'grade', 'user']
    list_filter = ['user', 'status', 'due_date']
