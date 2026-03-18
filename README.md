# yep-21

Marketing + client/freelancer account foundation for the yep-21 freelance marketplace.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Implemented routes

Public:
- `/`
- `/about`
- `/blog`
- `/blog/:id`

Auth:
- `/register`
- `/login`
- `/forgot-password`
- `/reset-password`

Client-only:
- `/client/onboarding`
- `/client/account`
- `/client/jobs`
- `/client/jobs/new`
- `/client/jobs/:id`
- `/client/jobs/:id/edit`
- `/client/settings`

Freelancer-only:
- `/freelancer/onboarding`
- `/freelancer/account`
- `/freelancer/jobs`
- `/freelancer/jobs/:id`
- `/freelancer/settings`

The API layer is mocked with contract-shaped service functions for auth, client/freelancer profile, notifications, and password updates.
