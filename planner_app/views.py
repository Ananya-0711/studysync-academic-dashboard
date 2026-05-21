from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from .models import StudySession, StudyGoal
from setup_app.models import Subject


@login_required
def planner_view(request):
    user = request.user
    today = timezone.now().date()
    week_start = today - timezone.timedelta(days=today.weekday())
    week_end = week_start + timezone.timedelta(days=6)
    next_week_end = today + timezone.timedelta(days=7)

    today_sessions = StudySession.objects.filter(user=user, date=today).select_related('subject').order_by('start_time')
    weekly_sessions = StudySession.objects.filter(
        user=user, date__gte=week_start, date__lte=week_end
    ).select_related('subject').order_by('date', 'start_time')
    upcoming_sessions = StudySession.objects.filter(
        user=user, date__gt=today, date__lte=next_week_end
    ).select_related('subject').order_by('date', 'start_time')

    goals = StudyGoal.objects.filter(user=user)
    subjects = Subject.objects.filter(user=user)

    sessions_today_count = today_sessions.count()
    planned_hours_today = sum(float(s.duration_hours) for s in today_sessions)

    context = {
        'today': today,
        'today_sessions': today_sessions,
        'weekly_sessions': weekly_sessions,
        'upcoming_sessions': upcoming_sessions,
        'goals': goals,
        'subjects': subjects,
        'sessions_today_count': sessions_today_count,
        'planned_hours_today': planned_hours_today,
        'goals_count': goals.count(),
    }
    return render(request, 'planner/planner.html', context)


@login_required
def add_session(request):
    if request.method == 'POST':
        subject_id = request.POST.get('subject_id', '').strip()
        topic = request.POST.get('topic', '').strip()
        date = request.POST.get('date', '').strip()
        start_time = request.POST.get('start_time', '').strip()
        duration = request.POST.get('duration', '1.0').strip()

        if not topic or not date or not start_time:
            messages.error(request, 'Topic, date and time are required.')
            return redirect('planner_app:planner')

        subject = None
        if subject_id:
            subject = get_object_or_404(Subject, pk=subject_id, user=request.user)

        StudySession.objects.create(
            user=request.user,
            subject=subject,
            topic=topic,
            date=date,
            start_time=start_time,
            duration_hours=float(duration) if duration else 1.0,
            status='upcoming',
        )
        messages.success(request, f'Study session "{topic}" added.')
    return redirect('planner_app:planner')


@login_required
def add_goal(request):
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        target = request.POST.get('target', '').strip()
        unit = request.POST.get('unit', 'hours').strip()

        if not title or not target:
            messages.error(request, 'Goal title and target are required.')
            return redirect('planner_app:planner')

        StudyGoal.objects.create(
            user=request.user,
            title=title,
            target_value=float(target),
            unit=unit,
        )
        messages.success(request, f'Goal "{title}" added.')
    return redirect('planner_app:planner')


@login_required
def delete_session(request, pk):
    session = get_object_or_404(StudySession, pk=pk, user=request.user)
    if request.method == 'POST':
        session.delete()
        messages.success(request, 'Session removed.')
    return redirect('planner_app:planner')
