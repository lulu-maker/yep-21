from django.contrib import admin
from .models import CompanyProfile


@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'owner', 'industry', 'activity_status', 'verification_status', 'updated_at')
    list_filter = ('activity_status', 'verification_status', 'industry')
    search_fields = ('company_name', 'owner__email', 'owner__full_name')
