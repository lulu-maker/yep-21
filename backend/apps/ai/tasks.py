from celery import shared_task


@shared_task
def run_ai_job(job_id: str):
    return {'job_id': job_id, 'status': 'queued'}
