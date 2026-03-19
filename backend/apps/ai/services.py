from .models import AIRequestLog, AITaskStatus, ResumeParseRequest
from .tasks import process_ai_request, process_resume_parse


class AIServiceFacade:
    """Provider-agnostic facade for AI task orchestration."""

    def submit(self, *, user, task_type, payload):
        request = AIRequestLog.objects.create(user=user, task_type=task_type, payload=payload)
        process_ai_request.delay(request.id)
        return request


ai_service = AIServiceFacade()


def submit_resume_parse(*, user, source_document=None, source_url='', metadata=None):
    ai_request = AIRequestLog.objects.create(user=user, task_type='resume_parse', payload={'source_url': source_url})
    parse_request = ResumeParseRequest.objects.create(
        user=user,
        source_document=source_document,
        source_url=source_url,
        ai_request=ai_request,
        metadata=metadata or {},
    )
    process_resume_parse.delay(parse_request.id)
    return parse_request


def set_ai_request_failed(*, ai_request: AIRequestLog, message: str):
    ai_request.status = AITaskStatus.FAILED
    ai_request.error_message = message
    ai_request.save(update_fields=['status', 'error_message', 'updated_at'])
    return ai_request
