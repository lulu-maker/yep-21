from django.db import models


class ActivityStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    INACTIVE = 'inactive', 'Inactive'


class VerificationStatus(models.TextChoices):
    UNVERIFIED = 'unverified', 'Unverified'
    PENDING = 'pending', 'Pending'
    VERIFIED = 'verified', 'Verified'
    REJECTED = 'rejected', 'Rejected'
