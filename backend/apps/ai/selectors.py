from .models import AIRequestLog, ResumeParseRequest


def list_ai_requests(user):
    return AIRequestLog.objects.filter(user=user)


def list_resume_parse_requests(user):
    return ResumeParseRequest.objects.filter(user=user)
