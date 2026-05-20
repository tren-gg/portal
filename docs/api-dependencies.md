# API Dependencies

Changes required in the Tren API (`@tren/api`) for the portal to reach full functionality. Portal surfaces render informational placeholders until these land.

## Status key

- **Waiting** - Not started
- **In progress** - PR open or actively being worked
- **Landed** - Merged and deployed

---

| # | Dependency | Portal impact | Status |
|---|---|---|---|
| 1 | Register `tren-portal` OAuth client with `redirect_kind = 'web'`. Alter CHECK constraint to allow `'web'`. Add `oauth_client_redirect_uris` table with prod (`https://portal.tren.gg/auth/callback`) and dev (`http://localhost:3000/auth/callback`) URIs. Update `validateLoopbackRedirectUri` to only run for loopback clients; web clients get exact-match validation. | **Blocks all auth.** Portal cannot sign in without this. | Waiting |
| 2 | Extend `GET /v1/me` to include subscription info (status, plan, currentPeriodEnd, deviceLimit) or add `GET /v1/billing/subscription`. | Dashboard, billing, and download pages show "Unknown" status badges. | Waiting |
| 3 | Add device management endpoints: `GET /v1/me/devices`, `PATCH /v1/me/devices/:id` (rename), `DELETE /v1/me/devices/:id` (revoke). | Devices page shows empty-state placeholder. | Waiting |
| 4 | Add "revoke all sessions" endpoint (`POST /v1/me/sessions/revoke-all` or similar). | Account page "Sign out all" button is disabled. | Waiting |
| 5 | Add account deletion endpoint (`DELETE /v1/me` or `POST /v1/me/delete`). | Account page "Delete account" button is disabled. | Waiting |
| 6 | Implement Stripe integration: wire up `POST /v1/billing/checkout` (return Checkout URL), `POST /v1/billing/portal` (return Customer Portal URL), add `GET /v1/billing/subscription`, add Stripe webhook handler. | Billing, subscribe pages show informational placeholders. | Waiting |
| 7 | Signed-URL endpoint for loader download (short-lived URL bound to user session). | Download page shows "coming soon" placeholder. | Waiting |
