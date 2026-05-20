# Pages Reference

## Auth pages (unauthenticated)

### `/auth/sign-in`
Email entry form. Accepts `?plan` and `?next` query params from marketing site links. Server action generates PKCE verifier + state, stores them in a short-TTL encrypted cookie, calls `POST /oauth/email/start`, and redirects to `/auth/check-email`.

### `/auth/check-email`
Static confirmation page showing "we emailed a sign-in link to {email}" with a link back to sign-in to retry.

### `/auth/callback` (route handler)
Receives `?code` and `?state` from the API redirect. Validates state against the PKCE cookie, exchanges the code for tokens via `POST /oauth/token`, creates the session cookie, and redirects to the `next` param destination or `/dashboard`.

### `/auth/logout` (route handler)
Reads the session, calls `POST /oauth/logout` to revoke the refresh token, destroys the session cookie, and redirects to the marketing site.

## Authed pages

All authed pages are wrapped in `(authed)/layout.tsx` which calls `requireSession()` and renders the nav shell.

### `/dashboard`
Server component. Calls `GET /v1/me`. Shows user email, subscription status badge (currently "Unknown"), device count placeholder, member-since date, and a CTA linking to the marketing site pricing page.

### `/devices`
Empty-state placeholder. Waiting on `GET /v1/me/devices`, `PATCH /v1/me/devices/:id`, `DELETE /v1/me/devices/:id` endpoints.

### `/account`
Server component. Calls `GET /v1/me`. Shows email and account creation date. Two danger-zone actions (sign out all, delete account) are rendered as disabled buttons until their respective API endpoints exist.

### `/billing`
Shows current plan status (currently "Unknown" badge) and a support email link. Waiting on Stripe integration for the "Manage billing" button to work (would call `POST /v1/billing/portal`).

### `/billing/success`
Post-Stripe-checkout landing. Client component that waits ~10 seconds then redirects to `/dashboard`. If subscription isn't confirmed in time, shows a "payment processing" message.

### `/billing/canceled`
Shows "checkout canceled" copy with a link back to the marketing site pricing page.

### `/subscribe`
Reads `?plan` query param. Will call `POST /v1/billing/checkout` and redirect to Stripe Checkout URL. Currently shows a "coming soon" placeholder.

### `/download`
Shows "loader download is coming soon" placeholder. Will show a download button once a signed-URL endpoint and subscription check are available.

## Root

### `/`
Server component. Checks for session cookie: if authenticated, redirects to `/dashboard`; otherwise redirects to `/auth/sign-in`.
