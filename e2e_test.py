import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'studysync.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from django.conf import settings

# Temporarily allow testserver
if 'testserver' not in settings.ALLOWED_HOSTS:
    settings.ALLOWED_HOSTS.append('testserver')

def run_tests():
    c = Client(SERVER_NAME='testserver')
    print("Testing registration...")
    
    # Delete test user if exists
    User.objects.filter(email='test_e2e@example.com').delete()
    
    response = c.post('/signup/', {
        'first_name': 'Test',
        'last_name': 'End2End',
        'email': 'test_e2e@example.com',
        'password': 'Password123!',
        'confirm_password': 'Password123!'
    }, follow=True)
    print(f"Register Response (followed): {response.status_code} (URL: {response.request.get('PATH_INFO', '')})")
    
    print("Logging out to test explicit login...")
    c.post('/logout/', follow=True)

    print("Testing login...")
    response = c.post('/login/', {
        'email': 'test_e2e@example.com',
        'password': 'Password123!'
    }, follow=True)
    print(f"Login Response (followed): {response.status_code} (URL: {response.request.get('PATH_INFO', '')})")

    endpoints = [
        ('/dashboard/', 'Dashboard'),
        ('/attendance/', 'Attendance'),
        ('/assignments/', 'Assignments'),
        ('/notes/', 'Notes'),
        ('/planner/', 'Planner'),
        ('/calendar/', 'Calendar'),
        ('/setup/', 'Setup'),
    ]
    
    for url, name in endpoints:
        resp = c.get(url)
        print(f"{name} Response: {resp.status_code}")
        if resp.status_code != 200:
            print(f"FAILED on {name}")

    print("Testing add subject in Setup...")
    resp = c.post('/setup/subjects/add/', {
        'name': 'E2E Testing Subject',
        'code': 'E2E101',
        'credits': 4
    }, follow=True)
    print(f"Add Subject Response: {resp.status_code}")

    print("Testing add note...")
    resp = c.post('/notes/add/', {
        'title': 'Test Note',
        'content': 'This is a test note created during E2E testing.',
        'subject_id': '',
        'tags': 'test, e2e'
    }, follow=True)
    print(f"Add Note Response: {resp.status_code}")
    
    print("Testing add assignment...")
    resp = c.post('/assignments/add/', {
        'title': 'E2E Assignment',
        'subject_id': '',
        'due_date': '2026-12-31',
        'due_time': '23:59',
        'description': 'Test assignment'
    }, follow=True)
    print(f"Add Assignment Response: {resp.status_code}")

    print("Testing add planner session...")
    resp = c.post('/planner/sessions/add/', {
        'topic': 'E2E Session',
        'subject_id': '',
        'date': '2026-12-31',
        'start_time': '10:00',
        'duration': '2'
    }, follow=True)
    print(f"Add Planner Session Response: {resp.status_code}")
    
    print("Testing add planner goal...")
    resp = c.post('/planner/goals/add/', {
        'title': 'E2E Goal',
        'target': '20',
        'unit': 'hours'
    }, follow=True)
    print(f"Add Planner Goal Response: {resp.status_code}")

    print("Testing logout...")
    resp = c.post('/logout/', follow=True)
    print(f"Logout Response: {resp.status_code}")
    
    print("Done!")

if __name__ == '__main__':
    run_tests()
