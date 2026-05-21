from django.urls import path
from . import views

app_name = 'calendar_app'

urlpatterns = [
    path('calendar/', views.calendar_view, name='calendar'),
    path('calendar/events/add/', views.add_event, name='add_event'),
    path('calendar/events/<int:pk>/delete/', views.delete_event, name='delete_event'),
]
