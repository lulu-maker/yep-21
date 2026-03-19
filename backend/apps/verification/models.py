from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from apps.profiles.constants import VerificationStatus


class VerificationRecord(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveBigIntegerField()
    target = GenericForeignKey('content_type', 'object_id')
    status = models.CharField(max_length=24, choices=VerificationStatus.choices, default=VerificationStatus.UNVERIFIED)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    internal_notes = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['content_type', 'object_id'], name='uniq_verification_target')
        ]


class VerificationDocument(models.Model):
    record = models.ForeignKey(VerificationRecord, on_delete=models.CASCADE, related_name='documents')
    document_name = models.CharField(max_length=255)
    document_type = models.CharField(max_length=80, blank=True)
    document_file = models.FileField(upload_to='verification/documents/', blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
