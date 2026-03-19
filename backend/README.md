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
- API current user: `/api/auth/me/`
- API register/login foundation: `/api/auth/register/`, `/api/auth/login/`

## Foundation apps
Core implemented foundations:
- `apps.users` (custom user + roles)
- `apps.cms` (Wagtail page models + site settings)
- `apps.api` (health + auth/current-user endpoints)

Placeholder domain apps are scaffolded for future marketplace modules.
