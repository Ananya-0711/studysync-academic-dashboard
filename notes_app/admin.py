from django.contrib import admin
from .models import Note

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'is_pinned', 'updated_at', 'user']
    list_filter = ['user', 'is_pinned', 'subject']
