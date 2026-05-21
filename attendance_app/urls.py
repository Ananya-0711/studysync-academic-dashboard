from django.urls import path
from . import views

app_name = 'attendance_app'

urlpatterns = [
    path('attendance/', views.attendance_view, name='attendance'),
    path('attendance/mark/', views.mark_attendance, name='mark_attendance'),
]
