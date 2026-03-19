from .models import Project


def create_project(*, owner, payload: dict) -> Project:
    payload['owner'] = owner
    return Project.objects.create(**payload)
