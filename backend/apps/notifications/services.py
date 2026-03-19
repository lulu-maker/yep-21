from django.utils import timezone

from .models import Notification
from .tasks import deliver_notification


def create_notification(*, recipient, notification_type, payload=None, deliver_async=True):
    notification = Notification.objects.create(
        recipient=recipient,
        notification_type=notification_type,
        payload=payload or {},
    )
    if deliver_async:
        deliver_notification.delay(notification.id)
    return notification


def mark_all_read(*, user):
    return Notification.objects.filter(recipient=user, read_at__isnull=True).update(read_at=timezone.now())
