from django.contrib import admin
from .models import AttendanceRecord

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['date', 'subject', 'status', 'remark', 'user']
    list_filter = ['user', 'status', 'date']
    date_hierarchy = 'date'
