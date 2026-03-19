from .models import FreelancerProfile


def upsert_freelancer_profile(*, user, defaults: dict) -> FreelancerProfile:
    profile, _ = FreelancerProfile.objects.update_or_create(user=user, defaults=defaults)
    return profile
