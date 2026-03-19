from .models import Project


def list_public_projects():
    return Project.objects.filter(publication_status='open').select_related('owner', 'company')
