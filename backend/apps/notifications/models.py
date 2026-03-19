from django.conf import settings
from django.db import models
from django.utils import timezone


class NotificationType(models.TextChoices):
    PROPOSAL_RECEIVED = 'proposal_received', 'Proposal received'
    PROPOSAL_ACCEPTED = 'proposal_accepted', 'Proposal accepted'
    PROPOSAL_REJECTED = 'proposal_rejected', 'Proposal rejected'
    CONTRACT_CREATED = 'contract_created', 'Contract created'
    CONTRACT_COMPLETED = 'contract_completed', 'Contract completed'
    MESSAGE_RECEIVED = 'message_received', 'Message received'
    VERIFICATION_STATUS_UPDATED = 'verification_status_updated', 'Verification status updated'
    PAYMENT_STATUS_UPDATED = 'payment_status_updated', 'Payment status updated'


class Notification(models.Model):
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=64, choices=NotificationType.choices)
    payload = models.JSONField(default=dict, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)

    def mark_read(self):
        if not self.read_at:
            self.read_at = timezone.now()
            self.save(update_fields=['read_at'])

    def __str__(self):
        return f'Notification<{self.recipient_id}:{self.notification_type}>'
