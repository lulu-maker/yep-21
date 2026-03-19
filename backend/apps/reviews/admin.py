from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('contract', 'reviewer', 'reviewee', 'role', 'rating', 'created_at')
    list_filter = ('role', 'rating')
    search_fields = ('reviewer__email', 'reviewee__email', 'comment')
