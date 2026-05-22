from django.db import models
from django.contrib.auth.models import User
from setup_app.models import Subject
from django.utils import timezone


STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('completed', 'Completed'),
    ('overdue', 'Overdue'),
]


class Assignment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignments')
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True, related_name='assignments')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    due_date = models.DateField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    grade = models.CharField(max_length=5, blank=True, default='')
    submitted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['due_date', 'status']

    def __str__(self):
        return f"{self.title} [{self.status}]"

    def save(self, *args, **kwargs):
        # Auto-mark overdue if past due and still pending
        d_date = self.due_date
        if isinstance(d_date, str):
            from datetime import datetime
            try:
                d_date = datetime.strptime(d_date, "%Y-%m-%d").date()
            except ValueError:
                pass
        
        if self.status == 'pending' and hasattr(d_date, '__lt__') and d_date < timezone.now().date():
            self.status = 'overdue'
        super().save(*args, **kwargs)
