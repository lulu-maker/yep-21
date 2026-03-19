from apps.contracts.models import Contract

from .models import BillingRecord, PaymentStatus, Transaction


def create_billing_record(*, contract: Contract, client, freelancer, subtotal_amount, total_amount, currency='USD', tax_amount=0):
    return BillingRecord.objects.create(
        contract=contract,
        client=client,
        freelancer=freelancer,
        subtotal_amount=subtotal_amount,
        total_amount=total_amount,
        tax_amount=tax_amount,
        currency=currency,
    )


def record_transaction(*, user, amount, currency='USD', status=PaymentStatus.PENDING, billing_record=None, contract=None, payment_method=None, metadata=None):
    return Transaction.objects.create(
        user=user,
        amount=amount,
        currency=currency,
        status=status,
        billing_record=billing_record,
        contract=contract,
        payment_method=payment_method,
        metadata=metadata or {},
    )
