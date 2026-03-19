from django.db.models import Count

from .models import Notification


def list_notifications(user):
    return Notification.objects.filter(recipient=user)


def unread_count(user):
    return Notification.objects.filter(recipient=user, read_at__isnull=True).count()


def unread_summary_for_users(user_ids):
    return (
        Notification.objects.filter(recipient_id__in=user_ids, read_at__isnull=True)
        .values('recipient_id')
        .annotate(total=Count('id'))
    )
