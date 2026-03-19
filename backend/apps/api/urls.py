from django.urls import path
from .views import HealthCheckView, CurrentUserView, RegisterView, LoginView
from .domain_views import (
    MyProfileView,
    FreelancerListView,
    FreelancerDetailView,
    CompanyListView,
    CompanyDetailView,
    ProjectListCreateView,
    ProjectDetailView,
    FavoriteListCreateView,
    FavoriteDeleteView,
    ProposalListCreateView,
    ContractListView,
    ContractDetailView,
    ReviewListCreateView,
    VerificationSelfView,
)

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('auth/me/', CurrentUserView.as_view(), name='current-user'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('profiles/me/', MyProfileView.as_view(), name='my-profile'),
    path('freelancers/', FreelancerListView.as_view(), name='freelancer-list'),
    path('freelancers/<int:pk>/', FreelancerDetailView.as_view(), name='freelancer-detail'),
    path('companies/', CompanyListView.as_view(), name='company-list'),
    path('companies/<int:pk>/', CompanyDetailView.as_view(), name='company-detail'),
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('favorites/', FavoriteListCreateView.as_view(), name='favorite-list-create'),
    path('favorites/<int:pk>/', FavoriteDeleteView.as_view(), name='favorite-delete'),
    path('proposals/', ProposalListCreateView.as_view(), name='proposal-list-create'),
    path('contracts/', ContractListView.as_view(), name='contract-list'),
    path('contracts/<int:pk>/', ContractDetailView.as_view(), name='contract-detail'),
    path('reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('verification/me/', VerificationSelfView.as_view(), name='verification-self'),
]
