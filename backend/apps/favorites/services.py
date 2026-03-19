from django.contrib.contenttypes.models import ContentType
from .models import Favorite


def add_favorite(*, user, obj):
    ct = ContentType.objects.get_for_model(obj)
    favorite, _ = Favorite.objects.get_or_create(user=user, content_type=ct, object_id=obj.pk)
    return favorite


def remove_favorite(*, user, obj):
    ct = ContentType.objects.get_for_model(obj)
    Favorite.objects.filter(user=user, content_type=ct, object_id=obj.pk).delete()
