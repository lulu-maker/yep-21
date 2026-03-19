from django.conf import settings
from django.db import models
from django.db.models import Q
from apps.freelancers.models import FreelancerProfile
from apps.projects.models import Project


class ProposalStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    SHORTLISTED = 'shortlisted', 'Shortlisted'
    REJECTED = 'rejected', 'Rejected'
    ACCEPTED = 'accepted', 'Accepted'


class Proposal(models.Model):
    freelancer = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='proposals')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='proposals')
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submitted_proposals')
    cover_letter = models.TextField()
    bid_amount = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_days = models.PositiveIntegerField()
    status = models.CharField(max_length=24, choices=ProposalStatus.choices, default=ProposalStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)
        constraints = [
            models.UniqueConstraint(
                fields=['freelancer', 'project'],
                condition=Q(status__in=[ProposalStatus.PENDING, ProposalStatus.SHORTLISTED, ProposalStatus.ACCEPTED]),
                name='uniq_active_proposal_per_freelancer_project',
            )
        ]

    def __str__(self):
        return f'{self.freelancer} -> {self.project}'
