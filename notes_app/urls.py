from django.urls import path
from . import views

app_name = 'notes_app'

urlpatterns = [
    path('notes/', views.notes_view, name='notes'),
    path('notes/add/', views.add_note, name='add_note'),
    path('notes/<int:pk>/pin/', views.toggle_pin, name='toggle_pin'),
    path('notes/<int:pk>/delete/', views.delete_note, name='delete_note'),
]
