"""
Context processor to inject notification data into every template.
This powers the bell notification dropdown across all pages.
"""
from django.utils import timezone
from assignments_app.models import Assignment
from attendance_app.models import AttendanceRecord
from setup_app.models import Subject


def notifications(request):
    """Build notification items for the bell dropdown."""
    if not request.user.is_authenticated:
        return {}

    user = request.user
    today = timezone.now().date()

    # --- Overdue assignments ---
    Assignment.objects.filter(
        user=user, status='pending', due_date__lt=today
    ).update(status='overdue')

    overdue_assignments = list(
        Assignment.objects.filter(user=user, status='overdue')
        .select_related('subject')
        .order_by('due_date')[:5]
    )

    # --- Assignments due today ---
    due_today = list(
        Assignment.objects.filter(user=user, status='pending', due_date=today)
        .select_related('subject')
        .order_by('due_date')[:5]
    )

    # --- Attendance alerts (subjects below 75%) ---
    attendance_alerts = []
    subjects = Subject.objects.filter(user=user)
    all_records = AttendanceRecord.objects.filter(user=user)
    for subj in subjects:
        records = all_records.filter(subject=subj)
        s_total = records.count()
        if s_total == 0:
            continue
        s_present = records.filter(status__in=['present', 'late']).count()
        pct = round((s_present / s_total) * 100)
        if pct < 75:
            attendance_alerts.append({
                'subject_name': subj.name,
                'pct': pct,
            })

    # Build flat notification list for the dropdown
    notif_items = []

    for a in overdue_assignments:
        notif_items.append({
            'type': 'overdue',
            'icon': 'danger',
            'title': 'Overdue Assignment',
            'message': f'"{a.title}" was due {a.due_date.strftime("%b %d")}. Submit ASAP!',
        })

    for a in due_today:
        notif_items.append({
            'type': 'due_today',
            'icon': 'warning',
            'title': 'Due Today',
            'message': f'"{a.title}" is due today. Don\'t forget to submit!',
        })

    for alert in attendance_alerts:
        notif_items.append({
            'type': 'attendance',
            'icon': 'danger',
            'title': 'Attendance Alert',
            'message': f'{alert["subject_name"]} attendance is at {alert["pct"]}%. Needs immediate attention.',
        })

    import json
    notif_count = len(notif_items)

    return {
        'notif_items': json.dumps(notif_items),
        'notif_count': notif_count,
    }
