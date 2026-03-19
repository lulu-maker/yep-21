from celery import shared_task


@shared_task
def send_notification_batch(notification_ids: list[str]):
    return {'processed': len(notification_ids)}
