from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from setup_app.models import Subject, TimetableSlot
from attendance_app.models import AttendanceRecord
from assignments_app.models import Assignment
from notes_app.models import Note
from planner_app.models import StudySession, StudyGoal
from calendar_app.models import CalendarEvent


@login_required
def home_view(request):
    user = request.user
    today = timezone.now().date()

    # Quick stats for the stats bar
    subjects = Subject.objects.filter(user=user)

    # Attendance rate (overall across all subjects)
    all_records = AttendanceRecord.objects.filter(user=user)
    total = all_records.count()
    present = all_records.filter(status__in=['present', 'late']).count()
    attendance_pct = round((present / total) * 100) if total > 0 else 0

    # Pending tasks
    pending_count = Assignment.objects.filter(user=user, status='pending').count()

    # Study sessions today
    sessions_today = StudySession.objects.filter(user=user, date=today).count()

    # Exams this week
    week_end = today + timezone.timedelta(days=7)
    exams_this_week = CalendarEvent.objects.filter(
        user=user, event_type='exam',
        date__gte=today, date__lte=week_end
    ).count()

    context = {
        'attendance_pct': attendance_pct,
        'pending_count': pending_count,
        'sessions_today': sessions_today,
        'exams_this_week': exams_this_week,
        'subjects': subjects,
    }
    return render(request, 'homepage/home.html', context)


@login_required
def dashboard_view(request):
    user = request.user
    today = timezone.now().date()
    week_start = today - timezone.timedelta(days=today.weekday())

    # Stats
    all_records = AttendanceRecord.objects.filter(user=user)
    total = all_records.count()
    present = all_records.filter(status__in=['present', 'late']).count()
    attendance_pct = round((present / total) * 100) if total > 0 else 0

    week_sessions = StudySession.objects.filter(user=user, date__gte=week_start)
    study_hours_week = sum(float(s.duration_hours) for s in week_sessions)

    pending_count = Assignment.objects.filter(user=user, status='pending').count()
    due_this_week = Assignment.objects.filter(
        user=user, status='pending',
        due_date__gte=today, due_date__lte=today + timezone.timedelta(days=7)
    ).count()

    # Attendance chart data per subject
    subjects = Subject.objects.filter(user=user)
    attendance_by_subject = []
    for subj in subjects:
        records = all_records.filter(subject=subj)
        s_total = records.count()
        s_present = records.filter(status__in=['present', 'late']).count()
        pct = round((s_present / s_total) * 100) if s_total > 0 else 0
        status = 'safe' if pct >= 75 else 'critical'
        attendance_by_subject.append({
            'subject': subj,
            'pct': pct,
            'status': status,
            'can_miss': max(0, int(s_total * 0.25) - (s_total - s_present)),
            'must_attend': max(0, int(s_total * 0.75) - s_present + 1) if pct < 75 else 0,
        })

    # Study hours per day this week (for chart)
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    hours_per_day = []
    for i in range(7):
        day = week_start + timezone.timedelta(days=i)
        hrs = sum(float(s.duration_hours) for s in StudySession.objects.filter(user=user, date=day))
        hours_per_day.append(hrs)

    # Assignment alerts (due within 7 days)
    upcoming_assignments = Assignment.objects.filter(
        user=user, status='pending',
        due_date__gte=today
    ).order_by('due_date')[:5]

    # Notifications (assignments due soon + overdue)
    overdue = Assignment.objects.filter(user=user, status='overdue').count()

    context = {
        'attendance_pct': attendance_pct,
        'study_hours_week': round(study_hours_week, 1),
        'pending_count': pending_count,
        'due_this_week': due_this_week,
        'attendance_by_subject': attendance_by_subject,
        'days': days,
        'hours_per_day': hours_per_day,
        'upcoming_assignments': upcoming_assignments,
        'overdue_count': overdue,
        'today': today,
    }
    return render(request, 'dashboard/dashboard.html', context)
