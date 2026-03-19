from celery import shared_task

from apps.notifications.models import NotificationType
from apps.notifications.services import create_notification


@shared_task
def handle_payment_event(event_type: str, payload: dict):
    return {'event_type': event_type, 'payload': payload, 'status': 'received'}


@shared_task
def notify_payment_status_updated(user_id: int, payload: dict | None = None):
    from apps.users.models import User

    user = User.objects.filter(id=user_id).first()
    if not user:
        return {'status': 'missing', 'user_id': user_id}
    create_notification(
        recipient=user,
        notification_type=NotificationType.PAYMENT_STATUS_UPDATED,
        payload=payload or {},
    )
    return {'status': 'queued', 'user_id': user_id}
