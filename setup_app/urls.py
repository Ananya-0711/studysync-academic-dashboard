from django.urls import path
from . import views

app_name = 'setup_app'

urlpatterns = [
    path('setup/', views.setup_view, name='setup'),
    path('setup/subjects/add/', views.add_subject, name='add_subject'),
    path('setup/subjects/<int:pk>/delete/', views.delete_subject, name='delete_subject'),
    path('setup/slots/add/', views.add_slot, name='add_slot'),
    path('setup/slots/<int:pk>/delete/', views.delete_slot, name='delete_slot'),
]
