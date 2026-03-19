from django.db.models import Q

from .models import BillingRecord, Transaction


def get_user_transactions(user):
    return Transaction.objects.filter(user=user).select_related('billing_record', 'contract')


def get_user_billing_records(user):
    return BillingRecord.objects.filter(Q(client=user) | Q(freelancer=user)).select_related('contract')
