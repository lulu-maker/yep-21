from celery import shared_task


@shared_task
def fanout_chat_event(event_id: str):
    return {'event_id': event_id, 'status': 'queued'}
