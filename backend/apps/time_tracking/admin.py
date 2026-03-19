from django.contrib import admin

from .models import TimeEntry, TimerSession


@admin.register(TimeEntry)
class TimeEntryAdmin(admin.ModelAdmin):
    list_display = ('id', 'contract', 'user', 'entry_date', 'duration_minutes', 'approval_status', 'created_at')
    list_filter = ('approval_status', 'entry_date')
    search_fields = ('user__email', 'contract__id')


@admin.register(TimerSession)
class TimerSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'contract', 'user', 'started_at', 'ended_at', 'is_running')
    list_filter = ('is_running',)
    search_fields = ('user__email', 'contract__id')
