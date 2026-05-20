# API Dependencies

Changes required in the Tren API (`@tren/api`) for the portal to reach full functionality. Portal surfaces render informational placeholders until these land.

Source: `../../../api/src`

## Status key

- **Waiting** - Not started
- **In progress** - PR open or actively being worked
- **Landed** - Merged and deployed

---

| # | Dependency | Portal impact | Status |
|---|---|---|---|
| 1 | Register `tren-portal` OAuth client with `redirect_kind = 'web'`. Add `oauth_client_redirect_uris` table with prod and dev callback URIs. Web clients get exact-match URI validation instead of loopback validation. | **Blocks all auth.** Portal cannot sign in without this. | Landed |
| 2 | Extend `GET /v1/me` to include subscription info (status, plan, currentPeriodEnd, deviceLimit) and add `GET /v1/billing/subscription`. | Dashboard, billing, and download pages show "Unknown" status badges. | Landed |
| 3 | Add device management endpoints: `GET /v1/me/devices`, `PATCH /v1/me/devices/:id` (rename), `DELETE /v1/me/devices/:id` (revoke). | Devices page shows empty-state placeholder. | Landed |
| 4 | Add "revoke all sessions" endpoint (`POST /v1/me/sessions/revoke-all`). | Account page "Sign out all" button is disabled. | Landed |
| 5 | Add account deletion endpoint (`DELETE /v1/me`). | Account page "Delete account" button is disabled. | Landed |
| 6 | Implement Stripe integration: wire up `POST /v1/billing/checkout` (return Checkout URL), `POST /v1/billing/portal` (return Customer Portal URL), add `GET /v1/billing/subscription`, add Stripe webhook handler at `POST /v1/billing/webhook`. | Billing, subscribe pages show informational placeholders. | Landed |
| 7 | Signed-URL endpoint for loader download (`POST /v1/download/url`, short-lived HMAC-signed URL bound to user session). | Download page shows "coming soon" placeholder. | Landed |

---

## Current API surface (v0.2.0)

Runtime dependencies: `express`, `helmet`, `cors`, `pg`, `stripe`, `zod`, `dotenv`

### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | None | Service metadata and endpoint index |
| GET | `/health` | None | Health check |
| GET | `/v1/status` | None | Runtime status (auth mode, stripe state) |
| GET | `/oauth/authorize` | None | Renders email sign-in page |
| POST | `/oauth/authorize` | None | Submits sign-in form |
| POST | `/oauth/email/start` | None | JSON email challenge start (PKCE) |
| GET | `/oauth/email/confirm` | None | Confirms magic link, redirects with auth code |
| POST | `/oauth/token` | None | Exchange code or refresh token for session |
| POST | `/oauth/logout` | None | Revoke a single refresh token |
| GET | `/v1/me` | Bearer | Returns user, subscription, clientId, scope, accessExpiresAt |
| GET | `/v1/me/devices` | Bearer | List active devices for the user |
| PATCH | `/v1/me/devices/:id` | Bearer | Rename a device |
| DELETE | `/v1/me/devices/:id` | Bearer | Revoke a device |
| POST | `/v1/me/sessions/revoke-all` | Bearer | Revoke all auth sessions for the user |
| DELETE | `/v1/me` | Bearer | Delete user account (cascading) |
| GET | `/v1/billing/subscription` | Bearer | Get subscription details |
| POST | `/v1/billing/checkout` | Bearer | Create Stripe Checkout session (returns URL) |
| POST | `/v1/billing/portal` | Bearer | Create Stripe Customer Portal session (returns URL) |
| POST | `/v1/billing/webhook` | Stripe signature | Stripe webhook handler |
| POST | `/v1/download/url` | Bearer | Generate short-lived signed download URL |
| GET | `/v1/licenses/public-key` | None | Ed25519 public key for offline verification |
| POST | `/v1/licenses/activate` | Bearer or email | Activate device, return entitlement token |
| POST | `/v1/licenses/refresh` | None (entitlement token in body) | Refresh entitlement token |
| POST | `/v1/licenses/verify` | None (entitlement token in body) | Verify entitlement token offline-capable |
| POST | `/v1/admin/subscriptions/manual` | x-admin-api-key | Create/update manual subscription |

### Auth model

OAuth 2.0 with PKCE (S256). Two client types:
- `loopback` - Native app clients; dynamic `http://127.0.0.1:<port>` redirect URIs
- `web` - Portal; exact-match against registered redirect URIs

Tokens:
- Access token: 15 min TTL, `tren_at_` prefix, SHA-256 hashed in DB
- Refresh token: 30 day TTL, `tren_rt_` prefix, rotation on each use
- Entitlement token: Ed25519-signed JWS, configurable TTL (default 72h)

### Database

PostgreSQL 16 (Alpine). Tables: `users`, `subscriptions`, `devices`, `entitlement_events`, `oauth_clients`, `oauth_client_redirect_uris`, `authorization_codes`, `email_login_challenges`, `auth_sessions`.

### Environment variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `PORT` | No | 3001 | Server listen port |
| `APP_ORIGIN` | No | `http://localhost:3000` | CORS origin (portal URL) |
| `API_PUBLIC_URL` | No | `http://localhost:3001` | Public base URL for magic links |
| `NODE_ENV` | No | `development` | Environment mode |
| `TOKEN_ISSUER` | No | `tren-api` | JWS `iss` claim |
| `TOKEN_TTL_HOURS` | No | 72 | Entitlement token lifetime |
| `DEVICE_LIMIT` | No | 3 | Default device limit for new subscriptions |
| `TOKEN_PRIVATE_KEY_BASE64` | No | - | Ed25519 private key (DER PKCS8 base64). Ephemeral key generated if absent. |
| `TOKEN_PUBLIC_KEY_BASE64` | No | - | Ed25519 public key (DER SPKI base64) |
| `ADMIN_API_KEY` | No | - | Required in production for admin routes |
| `STRIPE_SECRET_KEY` | No | - | Stripe API secret key. Billing endpoints return 501 when absent. |
| `STRIPE_WEBHOOK_SECRET` | No | - | Stripe webhook signing secret |
| `STRIPE_PRICE_ID_MONTHLY` | No | - | Stripe Price ID for monthly plan |
| `STRIPE_PRICE_ID_YEARLY` | No | - | Stripe Price ID for yearly plan |
| `DOWNLOAD_BASE_URL` | No | - | Base URL for signed download links |
| `DOWNLOAD_SIGNING_KEY` | No | - | HMAC key for signing download URLs |
