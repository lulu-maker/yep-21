from typing import Optional

from celery import shared_task

from apps.notifications.models import NotificationType
from apps.notifications.services import create_notification


@shared_task
def process_verification_request(request_id: str):
    return {'request_id': request_id, 'status': 'queued'}


@shared_task
def notify_verification_status_updated(user_id: int, payload: Optional[dict] = None):
    from apps.users.models import User

    user = User.objects.filter(id=user_id).first()
    if not user:
        return {'status': 'missing', 'user_id': user_id}
    create_notification(
        recipient=user,
        notification_type=NotificationType.VERIFICATION_STATUS_UPDATED,
        payload=payload or {},
    )
    return {'status': 'queued', 'user_id': user_id}
