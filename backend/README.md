# yep-21 backend foundation

Backend foundation for the yep-21 marketplace.

## Stack
- Django
- Wagtail
- PostgreSQL
- Redis
- Celery

## Quick start
1. Copy envs: `cp .env.example .env`
2. Install deps: `pip install -r requirements.txt`
3. Run migrations: `python manage.py migrate`
4. Create superuser: `python manage.py createsuperuser`
5. Run server: `python manage.py runserver`

## Celery
- Worker: `celery -A config worker -l info`
- Beat (optional): `celery -A config beat -l info`

## URL surface
- Django admin: `/django-admin/`
- Wagtail admin: `/admin/`
- API health: `/api/health/`
- API auth: `/api/auth/register/`, `/api/auth/login/`, `/api/auth/me/`
- API profile: `/api/profiles/me/`
- API discovery: `/api/freelancers/`, `/api/companies/`, `/api/projects/`
- API workflow: `/api/proposals/`, `/api/contracts/`, `/api/reviews/`, `/api/favorites/`, `/api/verification/me/`

## Foundation apps
Core implemented domain apps:
- `apps.users`
- `apps.profiles`
- `apps.companies`
- `apps.freelancers`
- `apps.projects` (jobs domain object)
- `apps.proposals`
- `apps.contracts`
- `apps.favorites`
- `apps.reviews`
- `apps.verification`
- `apps.cms`
- `apps.api`

Other domain apps remain scaffolded placeholders for future steps.
