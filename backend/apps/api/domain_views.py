from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from apps.ai.models import AIRequestLog, ResumeParseRequest
from apps.ai.services import ai_service, submit_resume_parse
from apps.chat.models import Conversation, Message
from apps.chat.services import create_conversation, mark_conversation_read, send_message
from apps.companies.models import CompanyProfile
from apps.companies.services import upsert_company_profile
from apps.contracts.models import Contract
from apps.favorites.models import Favorite
from apps.freelancers.models import FreelancerProfile
from apps.freelancers.services import upsert_freelancer_profile
from apps.notifications.models import Notification
from apps.notifications.selectors import unread_count
from apps.payments.selectors import get_user_billing_records, get_user_transactions
from apps.projects.models import Project
from apps.proposals.models import Proposal
from apps.proposals.services import submit_proposal
from apps.reviews.models import Review
from apps.reviews.services import create_review
from apps.time_tracking.models import TimeEntry
from apps.verification.models import VerificationRecord
from apps.verification.services import submit_verification

from .domain_serializers import (
    AIRequestLogSerializer,
    BillingRecordSerializer,
    CompanyProfileSerializer,
    ContractSerializer,
    ConversationSerializer,
    FavoriteSerializer,
    FreelancerProfileSerializer,
    MessageSerializer,
    NotificationSerializer,
    ProjectSerializer,
    ProposalSerializer,
    ResumeParseRequestSerializer,
    ReviewSerializer,
    TimeEntrySerializer,
    TransactionSerializer,
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


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)


class NotificationMarkReadView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        notification = get_object_or_404(Notification, id=pk, recipient=request.user)
        notification.mark_read()
        return Response({'status': 'ok'})


class NotificationUnreadCountView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'unread_count': unread_count(request.user)})


class ConversationListCreateView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants__user=self.request.user).distinct()

    def perform_create(self, serializer):
        participant_ids = serializer.validated_data.pop('participant_ids', [])
        participants = list(type(self.request.user).objects.filter(id__in=participant_ids))
        conversation = create_conversation(created_by=self.request.user, participants=participants, **serializer.validated_data)
        serializer.instance = conversation


class ConversationDetailView(generics.RetrieveAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants__user=self.request.user).distinct()


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation = get_object_or_404(Conversation, id=self.kwargs['conversation_id'], participants__user=self.request.user)
        return Message.objects.filter(conversation=conversation).select_related('sender')

    def perform_create(self, serializer):
        conversation = get_object_or_404(Conversation, id=self.kwargs['conversation_id'])
        message = send_message(
            conversation=conversation,
            sender=self.request.user,
            content=serializer.validated_data['content'],
            attachment_url=serializer.validated_data.get('attachment_url', ''),
        )
        serializer.instance = message


class ConversationMarkReadView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        conversation = get_object_or_404(Conversation, id=pk, participants__user=request.user)
        mark_conversation_read(conversation=conversation, user=request.user)
        return Response({'status': 'ok'})


class TimeEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = TimeEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TimeEntry.objects.filter(contract__client=self.request.user) | TimeEntry.objects.filter(contract__freelancer=self.request.user)

    def perform_create(self, serializer):
        contract = serializer.validated_data['contract']
        if contract.freelancer_id != self.request.user.id:
            raise PermissionDenied('Only assigned freelancer can add time entries.')
        serializer.save(user=self.request.user)


class TimeEntryDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = TimeEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TimeEntry.objects.filter(user=self.request.user)


class BillingRecordListView(generics.ListAPIView):
    serializer_class = BillingRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return get_user_billing_records(self.request.user)


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return get_user_transactions(self.request.user)


class AIRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = AIRequestLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AIRequestLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        request = ai_service.submit(
            user=self.request.user,
            task_type=serializer.validated_data['task_type'],
            payload=serializer.validated_data.get('payload', {}),
        )
        serializer.instance = request


class AIRequestDetailView(generics.RetrieveAPIView):
    serializer_class = AIRequestLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AIRequestLog.objects.filter(user=self.request.user)


class OCRResumeParseListCreateView(generics.ListCreateAPIView):
    serializer_class = ResumeParseRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ResumeParseRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        parse_request = submit_resume_parse(
            user=self.request.user,
            source_document=serializer.validated_data.get('source_document'),
            source_url=serializer.validated_data.get('source_url', ''),
            metadata=serializer.validated_data.get('metadata', {}),
        )
        serializer.instance = parse_request


class OCRResumeParseDetailView(generics.RetrieveAPIView):
    serializer_class = ResumeParseRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ResumeParseRequest.objects.filter(user=self.request.user)
