from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from .models import Assignment
from setup_app.models import Subject


@login_required
def assignments_view(request):
    user = request.user
    today = timezone.now().date()

    # Auto-update overdue
    Assignment.objects.filter(
        user=user, status='pending', due_date__lt=today
    ).update(status='overdue')

    pending = Assignment.objects.filter(user=user, status='pending').select_related('subject').order_by('due_date')
    completed = Assignment.objects.filter(user=user, status='completed').select_related('subject').order_by('-submitted_at')
    overdue = Assignment.objects.filter(user=user, status='overdue').select_related('subject').order_by('due_date')
    all_assignments = Assignment.objects.filter(user=user).select_related('subject').order_by('due_date')

    subjects = Subject.objects.filter(user=user)

    context = {
        'pending': pending,
        'completed': completed,
        'overdue': overdue,
        'all_assignments': all_assignments,
        'subjects': subjects,
        'pending_count': pending.count(),
        'completed_count': completed.count(),
        'overdue_count': overdue.count(),
        'total_count': all_assignments.count(),
        'today': today,
    }
    return render(request, 'assignments/assignments.html', context)


@login_required
def add_assignment(request):
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        subject_id = request.POST.get('subject_id', '').strip()
        description = request.POST.get('description', '').strip()
        due_date = request.POST.get('due_date', '').strip()

        if not title or not due_date:
            messages.error(request, 'Title and due date are required.')
            return redirect('assignments_app:assignments')

        subject = None
        if subject_id:
            subject = get_object_or_404(Subject, pk=subject_id, user=request.user)

        Assignment.objects.create(
            user=request.user,
            subject=subject,
            title=title,
            description=description,
            due_date=due_date,
            status='pending',
        )
        messages.success(request, f'Assignment "{title}" added.')
    return redirect('assignments_app:assignments')


@login_required
def mark_done(request, pk):
    assignment = get_object_or_404(Assignment, pk=pk, user=request.user)
    if request.method == 'POST':
        assignment.status = 'completed'
        assignment.submitted_at = timezone.now()
        grade = request.POST.get('grade', '').strip()
        if grade:
            assignment.grade = grade
        assignment.save()
        messages.success(request, f'"{assignment.title}" marked as completed.')
    return redirect('assignments_app:assignments')


@login_required
def delete_assignment(request, pk):
    assignment = get_object_or_404(Assignment, pk=pk, user=request.user)
    if request.method == 'POST':
        title = assignment.title
        assignment.delete()
        messages.success(request, f'Assignment "{title}" deleted.')
    return redirect('assignments_app:assignments')
