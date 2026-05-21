from django.urls import path
from . import views

app_name = 'planner_app'

urlpatterns = [
    path('planner/', views.planner_view, name='planner'),
    path('planner/sessions/add/', views.add_session, name='add_session'),
    path('planner/sessions/<int:pk>/delete/', views.delete_session, name='delete_session'),
    path('planner/goals/add/', views.add_goal, name='add_goal'),
]
