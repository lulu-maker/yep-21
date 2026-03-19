from celery import shared_task


@shared_task
def process_verification_request(request_id: str):
    return {'request_id': request_id, 'status': 'queued'}
