from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from apps.companies.models import CompanyProfile
from apps.favorites.models import Favorite
from apps.freelancers.models import FreelancerProfile
from apps.projects.models import Project
from apps.proposals.models import Proposal
from apps.contracts.models import Contract
from apps.reviews.models import Review
from apps.verification.models import VerificationRecord


class FreelancerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreelancerProfile
        exclude = ()
        read_only_fields = ('user', 'activity_status', 'verification_status', 'profile_completeness', 'created_at', 'updated_at')


class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        exclude = ()
        read_only_fields = ('owner', 'activity_status', 'verification_status', 'created_at', 'updated_at')


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('owner', 'slug', 'created_at', 'updated_at')


class ProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = '__all__'
        read_only_fields = ('submitted_by', 'status', 'created_at', 'updated_at')


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('reviewer', 'created_at')


class FavoriteSerializer(serializers.ModelSerializer):
    target_type = serializers.CharField(write_only=True)
    target_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'user', 'content_type', 'object_id', 'created_at', 'target_type', 'target_id')
        read_only_fields = ('user', 'content_type', 'object_id', 'created_at')

    def create(self, validated_data):
        target_type = validated_data.pop('target_type')
        target_id = validated_data.pop('target_id')

        model_map = {'project': Project, 'freelancer': FreelancerProfile}
        if target_type not in model_map:
            raise serializers.ValidationError({'target_type': 'Unsupported target type.'})

        model_cls = model_map[target_type]
        content_type = ContentType.objects.get_for_model(model_cls)
        favorite, _ = Favorite.objects.get_or_create(
            user=self.context['request'].user,
            content_type=content_type,
            object_id=target_id,
        )
        return favorite


class VerificationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationRecord
        fields = '__all__'
        read_only_fields = ('content_type', 'object_id', 'reviewed_at', 'reviewed_by', 'created_at', 'updated_at')
