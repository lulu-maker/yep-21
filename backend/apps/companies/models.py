from django.conf import settings
from django.db import models
from apps.profiles.models import ProfileBase


class CompanyProfile(ProfileBase):
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='company_profile')
    company_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    industry = models.CharField(max_length=120, blank=True)
    logo = models.ImageField(upload_to='companies/logos/', blank=True, null=True)

    class Meta:
        ordering = ('company_name',)

    def __str__(self):
        return self.company_name
