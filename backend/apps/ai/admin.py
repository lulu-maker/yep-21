from django.contrib import admin

from .models import AIRequestLog, ResumeParseRequest


@admin.register(AIRequestLog)
class AIRequestLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'task_type', 'status', 'provider', 'created_at')
    list_filter = ('task_type', 'status', 'provider')
    search_fields = ('user__email', 'external_reference')


@admin.register(ResumeParseRequest)
class ResumeParseRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'parsed_name', 'confidence', 'created_at')
    list_filter = ('status',)
    search_fields = ('user__email', 'parsed_name')
