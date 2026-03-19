from django.conf import settings
from django.db import models
from django.utils.text import slugify
from apps.companies.models import CompanyProfile


class BudgetType(models.TextChoices):
    FIXED = 'fixed', 'Fixed'
    HOURLY = 'hourly', 'Hourly'


class WorkplaceType(models.TextChoices):
    REMOTE = 'remote', 'Remote'
    HYBRID = 'hybrid', 'Hybrid'
    ON_SITE = 'on_site', 'On-site'


class ContractType(models.TextChoices):
    FREELANCE = 'freelance', 'Freelance'
    AGENCY_CONTRACT = 'agency_contract', 'Agency contract'
    PERMANENT = 'permanent', 'Permanent'


class PublicationStatus(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    OPEN = 'open', 'Open'
    PAUSED = 'paused', 'Paused'
    CLOSED = 'closed', 'Closed'


class Project(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_projects')
    company = models.ForeignKey(CompanyProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    description = models.TextField()
    category = models.CharField(max_length=120, blank=True)
    skills = models.JSONField(default=list, blank=True)
    budget_type = models.CharField(max_length=24, choices=BudgetType.choices, default=BudgetType.FIXED)
    budget_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    workplace_type = models.CharField(max_length=24, choices=WorkplaceType.choices, default=WorkplaceType.REMOTE)
    contract_type = models.CharField(max_length=32, choices=ContractType.choices, default=ContractType.FREELANCE)
    country = models.CharField(max_length=120, blank=True)
    city = models.CharField(max_length=120, blank=True)
    duration = models.CharField(max_length=120, blank=True)
    start_timing = models.CharField(max_length=120, blank=True)
    publication_status = models.CharField(max_length=24, choices=PublicationStatus.choices, default=PublicationStatus.DRAFT)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
