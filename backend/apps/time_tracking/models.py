from django.conf import settings
from django.db import models

from apps.contracts.models import Contract


class EntryStatus(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    SUBMITTED = 'submitted', 'Submitted'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'


class TimeEntry(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='time_entries')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='time_entries')
    entry_date = models.DateField()
    duration_minutes = models.PositiveIntegerField()
    note = models.TextField(blank=True)
    approval_status = models.CharField(max_length=24, choices=EntryStatus.choices, default=EntryStatus.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-entry_date', '-created_at')


class TimerSession(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='timer_sessions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='timer_sessions')
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
    note = models.CharField(max_length=255, blank=True)
    is_running = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-started_at',)
