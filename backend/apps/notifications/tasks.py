from celery import shared_task
from django.utils import timezone

from .models import Notification


@shared_task
def deliver_notification(notification_id: int):
    notification = Notification.objects.filter(id=notification_id).first()
    if not notification:
        return {'status': 'missing', 'notification_id': notification_id}
    return {'status': 'delivered', 'notification_id': notification_id, 'delivered_at': timezone.now().isoformat()}


@shared_task
def send_email_placeholder(subject: str, body: str, recipient_email: str):
    return {'status': 'queued', 'subject': subject, 'recipient_email': recipient_email, 'body_preview': body[:120]}
