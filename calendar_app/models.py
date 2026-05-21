from django.db import models
from django.contrib.auth.models import User


EVENT_TYPE_CHOICES = [
    ('exam', 'Exam'),
    ('event', 'Event'),
    ('deadline', 'Deadline'),
    ('meeting', 'Meeting'),
    ('reminder', 'Reminder'),
]


class CalendarEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='calendar_events')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    event_type = models.CharField(max_length=15, choices=EVENT_TYPE_CHOICES, default='event')
    date = models.DateField()
    time = models.TimeField(null=True, blank=True)
    location = models.CharField(max_length=200, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.title} ({self.event_type}) — {self.date}"

    @property
    def badge_class(self):
        return {
            'exam': 'badge-red',
            'event': 'badge-green',
            'deadline': 'badge-blue',
            'meeting': 'badge-yellow',
            'reminder': 'badge-yellow',
        }.get(self.event_type, 'badge-gray')

    @property
    def dot_color(self):
        return {
            'exam': '#f43f5e',
            'event': '#10b981',
            'deadline': '#7c3aed',
            'meeting': '#f59e0b',
            'reminder': '#0ea5e9',
        }.get(self.event_type, '#9ca3af')
