from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'publication_status', 'budget_type', 'budget_min', 'budget_max', 'created_at')
    list_filter = ('publication_status', 'budget_type', 'workplace_type', 'contract_type')
    search_fields = ('title', 'owner__email', 'company__company_name', 'skills')
    prepopulated_fields = {'slug': ('title',)}
