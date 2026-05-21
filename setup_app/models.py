from django.db import models
from django.contrib.auth.models import User

DAY_CHOICES = [
    ('Monday', 'Monday'), ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'),
    ('Thursday', 'Thursday'), ('Friday', 'Friday'), ('Saturday', 'Saturday'),
]

COLOR_CHOICES = [
    ('#7C3AED', 'Violet'), ('#4F46E5', 'Indigo'), ('#0EA5E9', 'Sky'),
    ('#059669', 'Emerald'), ('#F59E0B', 'Amber'), ('#EF4444', 'Red'),
    ('#EC4899', 'Pink'), ('#14B8A6', 'Teal'),
]

BG_CHOICES = [
    ('#EDE9FE', 'Violet BG'), ('#E0E7FF', 'Indigo BG'), ('#E0F2FE', 'Sky BG'),
    ('#D1FAE5', 'Emerald BG'), ('#FEF3C7', 'Amber BG'), ('#FEE2E2', 'Red BG'),
    ('#FCE7F3', 'Pink BG'), ('#CCFBF1', 'Teal BG'),
]

COLOR_PAIRS = [
    ('#7C3AED', '#EDE9FE'), ('#4F46E5', '#E0E7FF'), ('#0EA5E9', '#E0F2FE'),
    ('#059669', '#D1FAE5'), ('#F59E0B', '#FEF3C7'), ('#EF4444', '#FEE2E2'),
    ('#EC4899', '#FCE7F3'), ('#14B8A6', '#CCFBF1'),
]


class Subject(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subjects')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    credits = models.PositiveIntegerField(default=3)
    color_hex = models.CharField(max_length=10, default='#7C3AED')
    bg_hex = models.CharField(max_length=10, default='#EDE9FE')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.code})"

    @property
    def initials(self):
        words = self.name.split()
        return ''.join(w[0].upper() for w in words[:2])


class TimetableSlot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='timetable_slots')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='slots')
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    start_time = models.TimeField()

    class Meta:
        ordering = ['day', 'start_time']

    def __str__(self):
        return f"{self.day} {self.start_time} - {self.subject.name}"
