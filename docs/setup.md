# Local Development Setup

## Prerequisites

- Node.js >= 20
- A running instance of the Tren API (`@tren/api`) on localhost:3001
- The `tren-portal` OAuth client registered in the API (see [api-dependencies.md](api-dependencies.md))

## Getting started

```bash
git clone <repo-url>
cd portal
npm install
cp .env.example .env.local
```

Edit `.env.local` with your local values:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
MARKETING_URL=http://localhost:5173
TREN_API_URL=http://localhost:3001
TREN_API_CLIENT_ID=tren-portal
IRON_SESSION_PASSWORD=<random 32+ character string>
IRON_SESSION_COOKIE_NAME=tren_portal_session
DEV_MODE=true
```

Generate a session password:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Running

```bash
npm run dev
```

Portal runs on http://localhost:3000. The API must be running on localhost:3001 for auth and data fetching to work.

## Auth flow in dev

1. Go to http://localhost:3000 (redirects to /auth/sign-in)
2. Enter an email address
3. The API logs the magic link to its console in dev mode (check the API terminal output for `[auth] Magic sign-in link for ...`)
4. Open that URL in your browser to complete sign-in

## Type checking

```bash
npm run lint     # ESLint
npx tsc --noEmit # TypeScript
```
