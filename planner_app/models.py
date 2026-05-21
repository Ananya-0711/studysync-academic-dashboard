from django.db import models
from django.contrib.auth.models import User
from setup_app.models import Subject


STATUS_CHOICES = [
    ('done', 'Done'),
    ('in_progress', 'In Progress'),
    ('upcoming', 'Upcoming'),
]


class StudySession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_sessions')
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True, related_name='study_sessions')
    topic = models.CharField(max_length=200)
    date = models.DateField()
    start_time = models.TimeField()
    duration_hours = models.DecimalField(max_digits=4, decimal_places=1, default=1.0)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='upcoming')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date', 'start_time']

    def __str__(self):
        return f"{self.date} | {self.topic} ({self.duration_hours}h)"


class StudyGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_goals')
    title = models.CharField(max_length=200)
    target_value = models.DecimalField(max_digits=6, decimal_places=1)
    current_value = models.DecimalField(max_digits=6, decimal_places=1, default=0)
    unit = models.CharField(max_length=20, default='hours', help_text='e.g. hours, tasks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.current_value}/{self.target_value} {self.unit})"

    @property
    def progress_percent(self):
        if self.target_value > 0:
            pct = (self.current_value / self.target_value) * 100
            return min(int(pct), 100)
        return 0
