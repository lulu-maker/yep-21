from .models import Contract
from apps.proposals.models import ProposalStatus


def create_contract_from_proposal(*, proposal, start_date, end_date=None):
    if proposal.status != ProposalStatus.ACCEPTED:
        raise ValueError('Contract can only be created from accepted proposals.')

    return Contract.objects.create(
        project=proposal.project,
        proposal=proposal,
        client=proposal.project.owner,
        freelancer=proposal.submitted_by,
        start_date=start_date,
        end_date=end_date,
    )
