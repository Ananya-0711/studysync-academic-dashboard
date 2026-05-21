from django.urls import path
from . import views

app_name = 'assignments_app'

urlpatterns = [
    path('assignments/', views.assignments_view, name='assignments'),
    path('assignments/add/', views.add_assignment, name='add_assignment'),
    path('assignments/<int:pk>/done/', views.mark_done, name='mark_done'),
    path('assignments/<int:pk>/delete/', views.delete_assignment, name='delete_assignment'),
]
