from django.contrib import admin
from .models import VerificationRecord, VerificationDocument


class VerificationDocumentInline(admin.TabularInline):
    model = VerificationDocument
    extra = 0


@admin.register(VerificationRecord)
class VerificationRecordAdmin(admin.ModelAdmin):
    list_display = ('content_type', 'object_id', 'status', 'submitted_at', 'reviewed_at', 'reviewed_by')
    list_filter = ('status', 'content_type')
    inlines = [VerificationDocumentInline]


@admin.register(VerificationDocument)
class VerificationDocumentAdmin(admin.ModelAdmin):
    list_display = ('record', 'document_name', 'document_type', 'created_at')
    search_fields = ('document_name',)
