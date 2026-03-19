from django.contrib.contenttypes.models import ContentType
from .models import VerificationRecord


def get_verification_for_obj(obj):
    ct = ContentType.objects.get_for_model(obj)
    return VerificationRecord.objects.filter(content_type=ct, object_id=obj.pk).first()
