from django.conf import settings
from django.db import models


class AITaskType(models.TextChoices):
    RESUME_PARSE = 'resume_parse', 'Resume parse'
    JOB_MATCHING = 'job_matching', 'Job matching'
    PROPOSAL_DRAFT = 'proposal_draft', 'Proposal draft'
    MODERATION = 'moderation', 'Moderation'
    PROFILE_RECOMMENDATION = 'profile_recommendation', 'Profile recommendation'


class AITaskStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    PROCESSING = 'processing', 'Processing'
    SUCCEEDED = 'succeeded', 'Succeeded'
    FAILED = 'failed', 'Failed'


class AIRequestLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='ai_requests')
    task_type = models.CharField(max_length=64, choices=AITaskType.choices)
    status = models.CharField(max_length=24, choices=AITaskStatus.choices, default=AITaskStatus.PENDING)
    payload = models.JSONField(default=dict, blank=True)
    result = models.JSONField(default=dict, blank=True)
    error_message = models.TextField(blank=True)
    provider = models.CharField(max_length=64, default='internal')
    external_reference = models.CharField(max_length=191, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)


class ResumeParseRequest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resume_parse_requests')
    source_document = models.FileField(upload_to='resumes/', blank=True)
    source_url = models.URLField(blank=True)
    status = models.CharField(max_length=24, choices=AITaskStatus.choices, default=AITaskStatus.PENDING)
    parsed_name = models.CharField(max_length=255, blank=True)
    parsed_skills = models.JSONField(default=list, blank=True)
    parsed_experience_summary = models.TextField(blank=True)
    confidence = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    ai_request = models.ForeignKey(AIRequestLog, on_delete=models.SET_NULL, null=True, blank=True, related_name='resume_parse_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)
