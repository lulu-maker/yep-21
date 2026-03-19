from django.conf import settings
from django.db import models
from apps.projects.models import Project
from apps.proposals.models import Proposal


class ContractStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    COMPLETED = 'completed', 'Completed'
    CANCELLED = 'cancelled', 'Cancelled'


class Contract(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='contracts')
    proposal = models.OneToOneField(Proposal, on_delete=models.PROTECT, related_name='contract')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_contracts')
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='freelancer_contracts')
    status = models.CharField(max_length=24, choices=ContractStatus.choices, default=ContractStatus.ACTIVE)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f'Contract #{self.id}'
