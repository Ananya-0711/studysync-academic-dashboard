from django.urls import path
from . import views

app_name = 'dashboard_app'

urlpatterns = [
    path('home/', views.home_view, name='home'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
]
