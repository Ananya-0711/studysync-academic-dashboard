from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Subject, TimetableSlot

DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

COLOR_PAIRS = [
    ('#7C3AED', '#EDE9FE'), ('#4F46E5', '#E0E7FF'), ('#0EA5E9', '#E0F2FE'),
    ('#059669', '#D1FAE5'), ('#F59E0B', '#FEF3C7'), ('#EF4444', '#FEE2E2'),
    ('#EC4899', '#FCE7F3'), ('#14B8A6', '#CCFBF1'),
]


@login_required
def setup_view(request):
    subjects = Subject.objects.filter(user=request.user)
    slots = TimetableSlot.objects.filter(user=request.user).select_related('subject')

    # Group slots by day
    timetable = {day: [] for day in DAYS_ORDER}
    for slot in slots:
        if slot.day in timetable:
            timetable[slot.day].append(slot)

    context = {
        'subjects': subjects,
        'timetable': timetable,
        'days': DAYS_ORDER,
        'subject_count': subjects.count(),
    }
    return render(request, 'setup/setup.html', context)


@login_required
def add_subject(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        code = request.POST.get('code', '').strip()
        credits = request.POST.get('credits', '3').strip()

        if not name or not code:
            messages.error(request, 'Subject name and code are required.')
            return redirect('setup_app:setup')

        # Auto-assign color from palette based on current count
        count = Subject.objects.filter(user=request.user).count()
        color, bg = COLOR_PAIRS[count % len(COLOR_PAIRS)]

        Subject.objects.create(
            user=request.user,
            name=name,
            code=code,
            credits=int(credits) if credits.isdigit() else 3,
            color_hex=color,
            bg_hex=bg,
        )
        messages.success(request, f'Subject "{name}" added successfully.')
    return redirect('setup_app:setup')


@login_required
def delete_subject(request, pk):
    subject = get_object_or_404(Subject, pk=pk, user=request.user)
    if request.method == 'POST':
        name = subject.name
        subject.delete()
        messages.success(request, f'Subject "{name}" deleted.')
    return redirect('setup_app:setup')


@login_required
def add_slot(request):
    if request.method == 'POST':
        subject_id = request.POST.get('subject_id', '').strip()
        day = request.POST.get('day', '').strip()
        start_time = request.POST.get('start_time', '').strip()

        if not subject_id or not day or not start_time:
            messages.error(request, 'All fields required.')
            return redirect('setup_app:setup')

        subject = get_object_or_404(Subject, pk=subject_id, user=request.user)
        TimetableSlot.objects.create(
            user=request.user,
            subject=subject,
            day=day,
            start_time=start_time,
        )
        messages.success(request, f'Timetable slot added for {subject.name}.')
    return redirect('setup_app:setup')


@login_required
def delete_slot(request, pk):
    slot = get_object_or_404(TimetableSlot, pk=pk, user=request.user)
    if request.method == 'POST':
        slot.delete()
        messages.success(request, 'Timetable slot removed.')
    return redirect('setup_app:setup')
