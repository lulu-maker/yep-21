from apps.contracts.models import ContractStatus
from .models import Review


def create_review(*, contract, reviewer, reviewee, role, rating, comment=''):
    if contract.status != ContractStatus.COMPLETED:
        raise ValueError('Review can only be left after contract completion.')
    return Review.objects.create(
        contract=contract,
        reviewer=reviewer,
        reviewee=reviewee,
        role=role,
        rating=rating,
        comment=comment,
    )
