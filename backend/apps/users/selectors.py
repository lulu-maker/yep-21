from typing import Optional

from .models import User


def get_user_by_email(email: str) -> Optional[User]:
    return User.objects.filter(email__iexact=email).first()
