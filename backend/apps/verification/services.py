from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from apps.profiles.constants import VerificationStatus
from .models import VerificationRecord


def submit_verification(obj, notes=''):
    ct = ContentType.objects.get_for_model(obj)
    record, _ = VerificationRecord.objects.get_or_create(content_type=ct, object_id=obj.pk)
    record.status = VerificationStatus.PENDING
    record.submitted_at = timezone.now()
    record.notes = notes
    record.save(update_fields=['status', 'submitted_at', 'notes', 'updated_at'])
    return record
