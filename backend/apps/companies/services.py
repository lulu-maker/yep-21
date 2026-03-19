from .models import CompanyProfile


def upsert_company_profile(*, user, defaults: dict) -> CompanyProfile:
    profile, _ = CompanyProfile.objects.update_or_create(owner=user, defaults=defaults)
    return profile
