# Feedback Inbox Lite

Very small SaaS-style MVP with required authentication.

## What it does

- Email/password registration and login
- Cookie-based session auth (`HttpOnly`, `SameSite=Lax`)
- Protected dashboard (`/app`) only for logged-in users
- Simple feedback inbox per user:
  - create feedback
  - mark open/done

## Tech

- Node.js + Express
- In-memory data store (no database)
- Password hashing via Node `crypto.scrypt`

## Run

```bash
npm install
npm run start
```

Open: `http://localhost:3000`

## Scripts

```bash
npm run dev       # watch mode
npm run start     # run app
npm run build     # copy JS from src to dist via tsc
npm run test      # vitest
```

## Notes

- Data resets when the server restarts.
- This is intentionally minimal and rough MVP quality.