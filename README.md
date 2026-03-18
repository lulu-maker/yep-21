# yep-21

Marketing + client account foundation for the yep-21 freelance marketplace.

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
- `/client/settings`

The API layer is mocked with contract-shaped service functions for auth, client profile, notifications, and password updates.
