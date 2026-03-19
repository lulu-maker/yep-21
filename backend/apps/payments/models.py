from django.conf import settings
from django.db import models

from apps.companies.models import CompanyProfile
from apps.contracts.models import Contract
from apps.freelancers.models import FreelancerProfile


class PaymentProvider(models.TextChoices):
    INTERNAL = 'internal', 'Internal'
    STRIPE = 'stripe', 'Stripe'
    PAYPAL = 'paypal', 'PayPal'
    OTHER = 'other', 'Other'


class PaymentStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    PROCESSING = 'processing', 'Processing'
    SUCCEEDED = 'succeeded', 'Succeeded'
    FAILED = 'failed', 'Failed'
    REFUNDED = 'refunded', 'Refunded'
    CANCELLED = 'cancelled', 'Cancelled'


class BillingProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='billing_profile')
    company = models.ForeignKey(CompanyProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='billing_profiles')
    freelancer = models.ForeignKey(FreelancerProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='billing_profiles')
    provider = models.CharField(max_length=32, choices=PaymentProvider.choices, default=PaymentProvider.INTERNAL)
    provider_customer_id = models.CharField(max_length=191, blank=True)
    provider_account_id = models.CharField(max_length=191, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'BillingProfile<{self.user_id}>'


class PaymentMethodReference(models.Model):
    billing_profile = models.ForeignKey(BillingProfile, on_delete=models.CASCADE, related_name='payment_methods')
    provider = models.CharField(max_length=32, choices=PaymentProvider.choices, default=PaymentProvider.INTERNAL)
    provider_payment_method_id = models.CharField(max_length=191)
    brand = models.CharField(max_length=64, blank=True)
    last4 = models.CharField(max_length=4, blank=True)
    exp_month = models.PositiveSmallIntegerField(null=True, blank=True)
    exp_year = models.PositiveSmallIntegerField(null=True, blank=True)
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f'PaymentMethod<{self.provider}:{self.provider_payment_method_id}>'


class BillingRecord(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.SET_NULL, null=True, blank=True, related_name='billing_records')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_billing_records')
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='freelancer_billing_records')
    currency = models.CharField(max_length=12, default='USD')
    subtotal_amount = models.DecimalField(max_digits=12, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    due_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=24, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f'BillingRecord#{self.id}'


class Transaction(models.Model):
    billing_record = models.ForeignKey(BillingRecord, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    contract = models.ForeignKey(Contract, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    payment_method = models.ForeignKey(PaymentMethodReference, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    provider = models.CharField(max_length=32, choices=PaymentProvider.choices, default=PaymentProvider.INTERNAL)
    provider_reference = models.CharField(max_length=191, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=12, default='USD')
    status = models.CharField(max_length=24, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    direction = models.CharField(max_length=16, default='charge')
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f'Transaction#{self.id}'


class Payout(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.SET_NULL, null=True, blank=True, related_name='payouts')
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payouts')
    provider = models.CharField(max_length=32, choices=PaymentProvider.choices, default=PaymentProvider.INTERNAL)
    provider_reference = models.CharField(max_length=191, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=12, default='USD')
    status = models.CharField(max_length=24, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    processed_at = models.DateTimeField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f'Payout#{self.id}'
