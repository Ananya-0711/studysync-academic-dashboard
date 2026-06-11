from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from .models import AttendanceRecord
from setup_app.models import Subject


@login_required
def attendance_view(request):
    user = request.user
    subjects = Subject.objects.filter(user=user)
    all_records = AttendanceRecord.objects.filter(user=user).select_related('subject').order_by('-date')

    # Overall stats
    total = all_records.count()
    present_count = all_records.filter(status='present').count()
    absent_count = all_records.filter(status='absent').count()
    late_count = all_records.filter(status='late').count()
    overall_pct = round(((present_count + late_count) / total) * 100) if total > 0 else 0

    # Per-subject stats
    subject_stats = []
    for subj in subjects:
        records = all_records.filter(subject=subj)
        s_total = records.count()
        s_present = records.filter(status='present').count()
        s_absent = records.filter(status='absent').count()
        s_late = records.filter(status='late').count()
        s_pct = round(((s_present + s_late) / s_total) * 100) if s_total > 0 else 0
        subject_stats.append({
            'subject': subj,
            'total': s_total,
            'present': s_present,
            'absent': s_absent,
            'late': s_late,
            'pct': s_pct,
        })

    # Recent 7 days records
    last_7 = timezone.now().date() - timezone.timedelta(days=7)
    recent_records = all_records.filter(date__gte=last_7)

    # Allowed absences left (assuming 75% minimum rule)
    allowed_left = max(0, int(total * 0.25) - absent_count) if total > 0 else 0

    context = {
        'subjects': subjects,
        'all_records': all_records,
        'recent_records': recent_records,
        'total': total,
        'present_count': present_count,
        'absent_count': absent_count,
        'late_count': late_count,
        'overall_pct': overall_pct,
        'subject_stats': subject_stats,
        'allowed_left': allowed_left,
        'today': timezone.now().date(),
    }
    return render(request, 'attendance/attendance.html', context)


@login_required
def mark_attendance(request):
    if request.method == 'POST':
        subject_id = request.POST.get('subject_id')
        date = request.POST.get('date')
        status = request.POST.get('status', 'present')
        remark = request.POST.get('remark', '')

        if not subject_id or not date:
            messages.error(request, 'Subject and date are required.')
            return redirect('attendance_app:attendance')

        # Only allow marking attendance for today or past dates (no future)
        from datetime import date as date_cls
        try:
            submitted_date = date_cls.fromisoformat(date)
        except (ValueError, TypeError):
            messages.error(request, 'Invalid date format.')
            return redirect('attendance_app:attendance')

        if submitted_date > timezone.now().date():
            messages.error(request, 'Attendance cannot be marked for future dates.')
            return redirect('attendance_app:attendance')

        # Only allow present or absent status
        if status not in ('present', 'absent'):
            messages.error(request, 'Status must be either Present or Absent.')
            return redirect('attendance_app:attendance')

        subject = get_object_or_404(Subject, pk=subject_id, user=request.user)
        obj, created = AttendanceRecord.objects.update_or_create(
            user=request.user,
            subject=subject,
            date=date,
            defaults={'status': status, 'remark': remark},
        )
        msg = 'Attendance marked' if created else 'Attendance updated'
        messages.success(request, f'{msg} for {subject.name}.')
    return redirect('attendance_app:attendance')
  