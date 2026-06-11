from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from .models import CalendarEvent


@login_required
def calendar_view(request):
    user = request.user
    today = timezone.now().date()
    month = int(request.GET.get('month', today.month))
    year = int(request.GET.get('year', today.year))
    week_end = today + timezone.timedelta(days=7)
    month_start = today.replace(day=1)
    if today.month == 12:
        month_end = today.replace(year=today.year + 1, month=1, day=1)
    else:
        month_end = today.replace(month=today.month + 1, day=1)

    all_events = CalendarEvent.objects.filter(user=user).order_by('date', 'time')
    upcoming_events = all_events.filter(date__gte=today).order_by('date', 'time')
    exams = all_events.filter(event_type='exam', date__gte=today).order_by('date')
    reminders = all_events.filter(event_type='reminder', date__gte=today).order_by('date')
    exams_this_week = exams.filter(date__lte=week_end).count()

    # Build calendar grid for current month
    import calendar as cal_module
    import datetime

    cal = cal_module.monthcalendar(year, month)

    # Filter events for the displayed month (not today's month)
    display_month_start = datetime.date(year, month, 1)
    if month == 12:
        display_month_end = datetime.date(year + 1, 1, 1)
    else:
        display_month_end = datetime.date(year, month + 1, 1)
    month_events = all_events.filter(date__gte=display_month_start, date__lt=display_month_end)

    # Map events to days
    events_by_day = {}
    for ev in month_events:
        events_by_day.setdefault(ev.date.day, []).append(ev)

    display_date = datetime.date(year, month, 1)

    if month == 1:
        prev_month = 12
        prev_year = year - 1
    else:
        prev_month = month - 1
        prev_year = year

    if month == 12:
        next_month = 1
        next_year = year + 1
    else:
        next_month = month + 1
        next_year = year

    context = {
        'all_events': all_events,
        'upcoming_events': upcoming_events[:10],
        'exams': exams,
        'reminders': reminders,
        'exams_this_week': exams_this_week,
        'upcoming_count': upcoming_events.count(),
        'reminders_count': reminders.count(),
        'today': today,

        'current_month': month,
        'current_year': year,

        'prev_month': prev_month,
        'prev_year': prev_year,
        'next_month': next_month,
        'next_year': next_year,

        'cal': cal,
        'events_by_day': events_by_day,
        'month_name': display_date.strftime('%B %Y'),
    }
    return render(request, 'calendar/calendar.html', context)


@login_required
def add_event(request):
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        event_type = request.POST.get('event_type', 'event').strip()
        date = request.POST.get('date', '').strip()
        time = request.POST.get('time', '').strip() or None
        location = request.POST.get('location', '').strip()

        if not title or not date:
            messages.error(request, 'Title and date are required.')
            return redirect('calendar_app:calendar')

        CalendarEvent.objects.create(
            user=request.user,
            title=title,
            description=description,
            event_type=event_type,
            date=date,
            time=time,
            location=location,
        )
        messages.success(request, f'Event "{title}" added.')
    return redirect('calendar_app:calendar')


@login_required
def delete_event(request, pk):
    event = get_object_or_404(CalendarEvent, pk=pk, user=request.user)
    if request.method == 'POST':
        title = event.title
        event.delete()
        messages.success(request, f'Event "{title}" deleted.')
    return redirect('calendar_app:calendar')
