from rest_framework.permissions import BasePermission


class IsRole(BasePermission):
    allowed_roles: tuple[str, ...] = tuple()

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in self.allowed_roles)


class IsClient(IsRole):
    allowed_roles = ('client',)


class IsFreelancer(IsRole):
    allowed_roles = ('freelancer',)


class IsPlatformAdmin(IsRole):
    allowed_roles = ('admin',)
