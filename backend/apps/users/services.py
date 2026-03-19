from .models import User


def register_user(*, email: str, full_name: str, role: str, password: str) -> User:
    return User.objects.create_user(email=email, full_name=full_name, role=role, password=password)
