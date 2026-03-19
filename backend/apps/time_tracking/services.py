from django.utils import timezone

from .models import TimeEntry, TimerSession


def create_time_entry(*, contract, user, entry_date, duration_minutes, note='', approval_status='draft'):
    return TimeEntry.objects.create(
        contract=contract,
        user=user,
        entry_date=entry_date,
        duration_minutes=duration_minutes,
        note=note,
        approval_status=approval_status,
    )


def start_timer(*, contract, user, note=''):
    TimerSession.objects.filter(contract=contract, user=user, is_running=True).update(is_running=False, ended_at=timezone.now())
    return TimerSession.objects.create(contract=contract, user=user, started_at=timezone.now(), note=note)


def stop_timer(*, timer_session):
    if timer_session.is_running:
        timer_session.is_running = False
        timer_session.ended_at = timezone.now()
        timer_session.save(update_fields=['is_running', 'ended_at'])
    return timer_session
