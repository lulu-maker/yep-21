from celery import shared_task

from apps.notifications.models import NotificationType
from apps.notifications.services import create_notification


@shared_task
def fanout_chat_event(message_id: str):
    return {'message_id': message_id, 'status': 'queued'}


@shared_task
def notify_message_received(user_id: int, payload: dict | None = None):
    from apps.users.models import User

    user = User.objects.filter(id=user_id).first()
    if not user:
        return {'status': 'missing', 'user_id': user_id}
    create_notification(recipient=user, notification_type=NotificationType.MESSAGE_RECEIVED, payload=payload or {})
    return {'status': 'queued', 'user_id': user_id}
