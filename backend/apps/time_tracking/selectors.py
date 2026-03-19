from django.db.models import Q

from .models import TimeEntry, TimerSession


def list_time_entries(user):
    return TimeEntry.objects.filter(Q(contract__client=user) | Q(contract__freelancer=user)).select_related('contract', 'user')


def list_running_timers(user):
    return TimerSession.objects.filter(user=user, is_running=True).select_related('contract')
