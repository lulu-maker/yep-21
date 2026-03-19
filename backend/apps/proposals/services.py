from .models import Proposal


def submit_proposal(*, freelancer_profile, project, submitted_by, payload: dict) -> Proposal:
    return Proposal.objects.create(
        freelancer=freelancer_profile,
        project=project,
        submitted_by=submitted_by,
        **payload,
    )
