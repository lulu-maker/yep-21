from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.response import Response
from apps.companies.models import CompanyProfile
from apps.companies.services import upsert_company_profile
from apps.freelancers.models import FreelancerProfile
from apps.freelancers.services import upsert_freelancer_profile
from apps.projects.models import Project
from apps.proposals.models import Proposal
from apps.proposals.services import submit_proposal
from apps.contracts.models import Contract
from apps.reviews.models import Review
from apps.reviews.services import create_review
from apps.verification.models import VerificationRecord
from apps.verification.services import submit_verification
from apps.favorites.models import Favorite
from .domain_serializers import (
    CompanyProfileSerializer,
    ContractSerializer,
    FavoriteSerializer,
    FreelancerProfileSerializer,
    ProjectSerializer,
    ProposalSerializer,
    ReviewSerializer,
    VerificationRecordSerializer,
)


class MyProfileView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role == 'freelancer':
            profile, _ = FreelancerProfile.objects.get_or_create(user=request.user)
            return Response(FreelancerProfileSerializer(profile).data)

        profile, _ = CompanyProfile.objects.get_or_create(owner=request.user, defaults={'company_name': request.user.full_name or request.user.email})
        return Response(CompanyProfileSerializer(profile).data)

    def patch(self, request):
        if request.user.role == 'freelancer':
            profile = upsert_freelancer_profile(user=request.user, defaults=request.data)
            return Response(FreelancerProfileSerializer(profile).data)

        profile = upsert_company_profile(user=request.user, defaults=request.data)
        return Response(CompanyProfileSerializer(profile).data)


class FreelancerListView(generics.ListAPIView):
    queryset = FreelancerProfile.objects.filter(activity_status='active')
    serializer_class = FreelancerProfileSerializer
    permission_classes = [permissions.AllowAny]


class FreelancerDetailView(generics.RetrieveAPIView):
    queryset = FreelancerProfile.objects.filter(activity_status='active')
    serializer_class = FreelancerProfileSerializer
    permission_classes = [permissions.AllowAny]


class CompanyListView(generics.ListAPIView):
    queryset = CompanyProfile.objects.filter(activity_status='active')
    serializer_class = CompanyProfileSerializer
    permission_classes = [permissions.AllowAny]


class CompanyDetailView(generics.RetrieveAPIView):
    queryset = CompanyProfile.objects.filter(activity_status='active')
    serializer_class = CompanyProfileSerializer
    permission_classes = [permissions.AllowAny]


class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all().select_related('owner', 'company')
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.method == 'GET':
            return qs.filter(publication_status='open')
        return qs.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProjectDetailView(generics.RetrieveUpdateAPIView):
    queryset = Project.objects.all().select_related('owner', 'company')
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if self.request.method in permissions.SAFE_METHODS:
            return Project.objects.filter(publication_status='open')
        return Project.objects.filter(owner=self.request.user)


class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FavoriteDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        favorite_id = self.kwargs['pk']
        return get_object_or_404(Favorite, id=favorite_id, user=self.request.user)


class ProposalListCreateView(generics.ListCreateAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'client':
            return Proposal.objects.filter(project__owner=self.request.user)
        return Proposal.objects.filter(submitted_by=self.request.user)

    def perform_create(self, serializer):
        freelancer_profile = get_object_or_404(FreelancerProfile, user=self.request.user)
        project = serializer.validated_data['project']
        submit_proposal(
            freelancer_profile=freelancer_profile,
            project=project,
            submitted_by=self.request.user,
            payload={
                'cover_letter': serializer.validated_data['cover_letter'],
                'bid_amount': serializer.validated_data['bid_amount'],
                'delivery_days': serializer.validated_data['delivery_days'],
            },
        )


class ContractListView(generics.ListAPIView):
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Contract.objects.filter(client=self.request.user) | Contract.objects.filter(freelancer=self.request.user)


class ContractDetailView(generics.RetrieveAPIView):
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Contract.objects.filter(client=self.request.user) | Contract.objects.filter(freelancer=self.request.user)


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        reviewee_id = self.request.query_params.get('reviewee_id')
        queryset = Review.objects.all()
        if reviewee_id:
            queryset = queryset.filter(reviewee_id=reviewee_id)
        return queryset

    def perform_create(self, serializer):
        review = create_review(
            contract=serializer.validated_data['contract'],
            reviewer=self.request.user,
            reviewee=serializer.validated_data['reviewee'],
            role=serializer.validated_data['role'],
            rating=serializer.validated_data['rating'],
            comment=serializer.validated_data.get('comment', ''),
        )
        serializer.instance = review


class VerificationSelfView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VerificationRecordSerializer

    def _target(self):
        if self.request.user.role == 'freelancer':
            return get_object_or_404(FreelancerProfile, user=self.request.user)
        return get_object_or_404(CompanyProfile, owner=self.request.user)

    def get(self, request):
        target = self._target()
        ct = ContentType.objects.get_for_model(target)
        record = VerificationRecord.objects.filter(content_type=ct, object_id=target.pk).first()
        if not record:
            record = VerificationRecord.objects.create(content_type=ct, object_id=target.pk)
        return Response(self.get_serializer(record).data)

    def post(self, request):
        target = self._target()
        record = submit_verification(target, notes=request.data.get('notes', ''))
        return Response(self.get_serializer(record).data)
