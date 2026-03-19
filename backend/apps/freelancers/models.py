from django.conf import settings
from django.db import models
from apps.profiles.models import ProfileBase


class AvailabilityStatus(models.TextChoices):
    OPEN_FOR_WORK = 'open_for_work', 'Open for work'
    PARTLY_AVAILABLE = 'partly_available', 'Partly available'
    UNAVAILABLE = 'unavailable', 'Unavailable'


class FreelancerProfile(ProfileBase):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='freelancer_profile')
    display_name = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    languages = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    availability_status = models.CharField(max_length=32, choices=AvailabilityStatus.choices, default=AvailabilityStatus.OPEN_FOR_WORK)
    profile_completeness = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ('-updated_at',)

    def __str__(self):
        return self.display_name or self.user.full_name or self.user.email
