from django.urls import path
from .views import HealthCheckView, CurrentUserView, RegisterView, LoginView

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('auth/me/', CurrentUserView.as_view(), name='current-user'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
]
