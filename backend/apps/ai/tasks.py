from celery import shared_task

from .models import AIRequestLog, AITaskStatus, ResumeParseRequest


@shared_task
def process_ai_request(ai_request_id: int):
    request = AIRequestLog.objects.filter(id=ai_request_id).first()
    if not request:
        return {'status': 'missing', 'ai_request_id': ai_request_id}

    request.status = AITaskStatus.SUCCEEDED
    request.result = {'message': 'AI task processed by placeholder worker.'}
    request.save(update_fields=['status', 'result', 'updated_at'])
    return {'status': 'ok', 'ai_request_id': ai_request_id}


@shared_task
def process_resume_parse(parse_request_id: int):
    parse_request = ResumeParseRequest.objects.filter(id=parse_request_id).select_related('ai_request').first()
    if not parse_request:
        return {'status': 'missing', 'parse_request_id': parse_request_id}

    parse_request.status = AITaskStatus.SUCCEEDED
    parse_request.parsed_name = 'Parsed Candidate'
    parse_request.parsed_skills = ['communication', 'python', 'project management']
    parse_request.parsed_experience_summary = 'Placeholder extracted experience summary from OCR parser.'
    parse_request.confidence = 78.5
    parse_request.metadata = {**parse_request.metadata, 'parser': 'mock_ocr_v1'}
    parse_request.save(
        update_fields=['status', 'parsed_name', 'parsed_skills', 'parsed_experience_summary', 'confidence', 'metadata', 'updated_at']
    )

    if parse_request.ai_request:
        parse_request.ai_request.status = AITaskStatus.SUCCEEDED
        parse_request.ai_request.result = {
            'resume_parse_request_id': parse_request.id,
            'skills_count': len(parse_request.parsed_skills),
        }
        parse_request.ai_request.save(update_fields=['status', 'result', 'updated_at'])

    return {'status': 'ok', 'parse_request_id': parse_request_id}
