from django.db.models import Q
from .models import Contract


def list_contracts_for_user(user):
    return Contract.objects.filter(Q(client=user) | Q(freelancer=user)).select_related('project', 'proposal')
