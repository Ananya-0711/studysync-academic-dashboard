from django.db import models
from django.contrib.auth.models import User
from setup_app.models import Subject


STATUS_CHOICES = [
    ('present', 'Present'),
    ('absent', 'Absent'),
    ('late', 'Late'),
]


class AttendanceRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendance_records')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='present')
    remark = models.CharField(max_length=200, blank=True, default='')

    class Meta:
        ordering = ['-date', 'subject']
        unique_together = ['user', 'subject', 'date']

    def __str__(self):
        return f"{self.date} | {self.subject.name} | {self.status}"
