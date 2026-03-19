from apps.projects.models import Project


def list_jobs():
    return Project.objects.all()
