from django.contrib import admin

from .models import BillingProfile, BillingRecord, PaymentMethodReference, Payout, Transaction


@admin.register(BillingProfile)
class BillingProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'provider', 'provider_customer_id', 'created_at')
    search_fields = ('user__email', 'provider_customer_id', 'provider_account_id')


@admin.register(PaymentMethodReference)
class PaymentMethodReferenceAdmin(admin.ModelAdmin):
    list_display = ('id', 'billing_profile', 'provider', 'brand', 'last4', 'is_default', 'is_active', 'created_at')
    list_filter = ('provider', 'is_default', 'is_active')


@admin.register(BillingRecord)
class BillingRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'contract', 'client', 'freelancer', 'total_amount', 'currency', 'status', 'created_at')
    list_filter = ('status', 'currency')
    search_fields = ('client__email', 'freelancer__email')


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'amount', 'currency', 'status', 'provider', 'created_at')
    list_filter = ('status', 'provider', 'currency')
    search_fields = ('user__email', 'provider_reference')


@admin.register(Payout)
class PayoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'freelancer', 'amount', 'currency', 'status', 'provider', 'created_at')
    list_filter = ('status', 'provider', 'currency')
    search_fields = ('freelancer__email', 'provider_reference')
