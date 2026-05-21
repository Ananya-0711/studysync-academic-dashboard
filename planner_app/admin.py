from django.contrib import admin
from .models import StudySession, StudyGoal

@admin.register(StudySession)
class StudySessionAdmin(admin.ModelAdmin):
    list_display = ['topic', 'subject', 'date', 'start_time', 'duration_hours', 'status', 'user']
    list_filter = ['user', 'status', 'date']

@admin.register(StudyGoal)
class StudyGoalAdmin(admin.ModelAdmin):
    list_display = ['title', 'current_value', 'target_value', 'unit', 'user']
    list_filter = ['user']
