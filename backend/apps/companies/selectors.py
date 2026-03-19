from .models import CompanyProfile


def list_public_companies():
    return CompanyProfile.objects.filter(activity_status='active')
