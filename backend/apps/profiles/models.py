from django.db import models
from .constants import ActivityStatus, VerificationStatus


class ProfileBase(models.Model):
    country = models.CharField(max_length=120, blank=True)
    phone_country_code = models.CharField(max_length=8, blank=True)
    phone_number = models.CharField(max_length=32, blank=True)
    avatar = models.ImageField(upload_to='profiles/avatars/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='profiles/covers/', blank=True, null=True)
    activity_status = models.CharField(max_length=24, choices=ActivityStatus.choices, default=ActivityStatus.ACTIVE)
    verification_status = models.CharField(max_length=24, choices=VerificationStatus.choices, default=VerificationStatus.UNVERIFIED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
