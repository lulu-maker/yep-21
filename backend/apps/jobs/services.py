from apps.projects.models import Project


def get_job_by_id(job_id: int) -> Project:
    return Project.objects.get(id=job_id)
