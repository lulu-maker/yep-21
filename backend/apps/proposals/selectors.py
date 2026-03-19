from .models import Proposal


def list_proposals_for_user(user):
    if getattr(user, 'is_client', False):
        return Proposal.objects.filter(project__owner=user).select_related('project', 'freelancer')
    return Proposal.objects.filter(submitted_by=user).select_related('project', 'freelancer')
