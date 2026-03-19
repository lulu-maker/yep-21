from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from apps.contracts.models import Contract


class ReviewRole(models.TextChoices):
    CLIENT_TO_FREELANCER = 'client_to_freelancer', 'Client to freelancer'
    FREELANCER_TO_CLIENT = 'freelancer_to_client', 'Freelancer to client'


class Review(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews_written')
    reviewee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews_received')
    role = models.CharField(max_length=48, choices=ReviewRole.choices)
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)
        constraints = [
            models.UniqueConstraint(fields=['contract', 'reviewer'], name='uniq_reviewer_per_contract')
        ]

    def __str__(self):
        return f'{self.contract_id}:{self.rating}'
