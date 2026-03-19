# yep-21 backend developer setup

Backend foundation for the yep-21 marketplace (Django + DRF + Wagtail + Celery).

## 1) Local developer setup

```bash
cd backend
cp .env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Start local dependencies
- PostgreSQL (must match `DATABASE_*` values in `.env`)
- Redis (must match `REDIS_URL` / Celery URLs)


## Troubleshooting install issues

### `No matching distribution found for Django>=5.1,<5.2`
This usually happens when either:
- your Python version is too old for the pinned Django version, or
- your package index mirror does not host that version.

This repo now pins Django to `4.2.x` for broader compatibility.

Recommended fix steps:

```bash
cd backend
python -m pip install --upgrade pip setuptools wheel
python -m pip --version
python --version
pip install -r requirements.txt
```

If you're already inside `backend/`, do **not** run `cd backend` again.
To exit the venv use:

```bash
deactivate
```

## 2) Database + admin bootstrap

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
```

## 3) Optional dev seed data

Use this lightweight command to quickly get client/freelancer/project records for local testing:

```bash
cd backend
python manage.py seed_dev_data
```

Seeded dev credentials:
- client: `client@example.com` / `devpass123!`
- freelancer: `freelancer@example.com` / `devpass123!`

## 4) Run services

### Django API/admin
```bash
cd backend
python manage.py runserver
```

### Celery worker
```bash
cd backend
celery -A config worker -l info
```

### Celery beat (optional)
```bash
cd backend
celery -A config beat -l info
```

## 5) Health + verification checks

- Liveness: `GET /api/health/`
- Readiness (DB probe): `GET /api/health/ready/`
- Django admin: `/django-admin/`
- Wagtail admin: `/admin/`

Quick check examples:

```bash
curl http://127.0.0.1:8000/api/health/
curl http://127.0.0.1:8000/api/health/ready/
```

## 6) Migrations workflow for contributors

When models change:

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py showmigrations
```

## 7) Smoke tests

Run minimal smoke tests for core API setup:

```bash
cd backend
python manage.py test apps.api.tests.test_smoke
```

## URL surface (current foundation)
- API health: `/api/health/`, `/api/health/ready/`
- API auth: `/api/auth/register/`, `/api/auth/login/`, `/api/auth/me/`
- API profile: `/api/profiles/me/`
- API discovery/workflow: `/api/freelancers/`, `/api/companies/`, `/api/projects/`, `/api/proposals/`, `/api/contracts/`, `/api/reviews/`, `/api/favorites/`, `/api/verification/me/`
- API operations: `/api/notifications/`, `/api/conversations/`, `/api/time-entries/`, `/api/billing-records/`, `/api/transactions/`, `/api/ai/requests/`, `/api/ai/ocr/resume-parse/`
