from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from .models import Note
from setup_app.models import Subject
from django.db.models import Count


@login_required
def notes_view(request):
    user = request.user
    last_7 = timezone.now().date() - timezone.timedelta(days=7)

    all_notes = Note.objects.filter(user=user).select_related('subject')
    pinned = all_notes.filter(is_pinned=True)
    recent = all_notes.filter(updated_at__date__gte=last_7)

    # Notes grouped by subject
    subjects = Subject.objects.filter(user=user)
    notes_by_subject = []
    for subj in subjects:
        subj_notes = all_notes.filter(subject=subj)
        if subj_notes.exists():
            notes_by_subject.append({
                'subject': subj,
                'count': subj_notes.count(),
                'last_updated': subj_notes.order_by('-updated_at').first().updated_at,
            })

    context = {
        'all_notes': all_notes,
        'pinned': pinned,
        'recent': recent,
        'notes_by_subject': notes_by_subject,
        'subjects': subjects,
        'total_count': all_notes.count(),
        'pinned_count': pinned.count(),
        'this_week_count': recent.count(),
        'subject_count': subjects.count(),
    }
    return render(request, 'notes/notes.html', context)


@login_required
def add_note(request):
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        content = request.POST.get('content', '').strip()
        subject_id = request.POST.get('subject_id', '').strip()
        tags = request.POST.get('tags', '').strip()
        is_pinned = request.POST.get('is_pinned') == 'on'

        if not title:
            messages.error(request, 'Note title is required.')
            return redirect('notes_app:notes')

        subject = None
        if subject_id:
            subject = get_object_or_404(Subject, pk=subject_id, user=request.user)

        Note.objects.create(
            user=request.user,
            subject=subject,
            title=title,
            content=content,
            tags=tags,
            is_pinned=is_pinned,
        )
        messages.success(request, f'Note "{title}" created.')
    return redirect('notes_app:notes')


@login_required
def toggle_pin(request, pk):
    note = get_object_or_404(Note, pk=pk, user=request.user)
    if request.method == 'POST':
        note.is_pinned = not note.is_pinned
        note.save()
    return redirect('notes_app:notes')


@login_required
def delete_note(request, pk):
    note = get_object_or_404(Note, pk=pk, user=request.user)
    if request.method == 'POST':
        title = note.title
        note.delete()
        messages.success(request, f'Note "{title}" deleted.')
    return redirect('notes_app:notes')
