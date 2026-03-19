from django.contrib import admin
from .models import Proposal


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'freelancer', 'status', 'bid_amount', 'delivery_days', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('project__title', 'freelancer__user__email', 'submitted_by__email')
