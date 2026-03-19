from django.contrib import admin
from .models import FreelancerProfile


@admin.register(FreelancerProfile)
class FreelancerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'display_name', 'title', 'availability_status', 'activity_status', 'verification_status')
    list_filter = ('availability_status', 'activity_status', 'verification_status')
    search_fields = ('user__email', 'display_name', 'title', 'skills')
