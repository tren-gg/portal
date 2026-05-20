# Authentication Flow

The portal uses a BFF (backend-for-frontend) pattern. The browser never sees API tokens; they live server-side in an encrypted iron-session cookie.

## Sign-in sequence

```
Browser                     Portal (Next.js)                 Tren API
  |                              |                              |
  |  GET /auth/sign-in           |                              |
  |  (?plan=X&next=/subscribe)   |                              |
  |----------------------------->|                              |
  |  <-- render email form       |                              |
  |                              |                              |
  |  POST (server action)        |                              |
  |  { email }                   |                              |
  |----------------------------->|                              |
  |                              |  generate PKCE verifier      |
  |                              |  generate state              |
  |                              |  store verifier+state+next   |
  |                              |  in encrypted PKCE cookie    |
  |                              |                              |
  |                              |  POST /oauth/email/start     |
  |                              |  { client_id, redirect_uri,  |
  |                              |    code_challenge, state,     |
  |                              |    scope, email }             |
  |                              |----------------------------->|
  |                              |  <-- 202 pending             |
  |                              |                              |
  |  302 /auth/check-email       |                              |
  |<-----------------------------|                              |
  |                              |                              |
  |  (user clicks email link)    |                              |
  |                              |                              |
  |                              |  GET /oauth/email/confirm    |
  |                              |                              |
  |  302 /auth/callback          |  (API redirects with code)   |
  |  ?code=X&state=Y             |<-----------------------------|
  |----------------------------->|                              |
  |                              |  read PKCE cookie            |
  |                              |  validate state              |
  |                              |                              |
  |                              |  POST /oauth/token           |
  |                              |  { grant_type: auth_code,    |
  |                              |    code, code_verifier,      |
  |                              |    client_id, redirect_uri } |
  |                              |----------------------------->|
  |                              |  <-- tokens                  |
  |                              |                              |
  |                              |  GET /v1/me                  |
  |                              |----------------------------->|
  |                              |  <-- user info               |
  |                              |                              |
  |                              |  create session cookie with  |
  |                              |  tokens + user info          |
  |                              |  destroy PKCE cookie         |
  |                              |                              |
  |  302 /dashboard              |                              |
  |  (or /subscribe?plan=X)      |                              |
  |<-----------------------------|                              |
```

## Marketing site handoff

When a user clicks "Get Started" on a marketing pricing card:

1. Marketing site links to `portal.tren.gg/auth/sign-in?plan=monthly&next=/subscribe`
2. The portal stashes `plan` and `next` in the PKCE cookie during sign-in
3. After successful auth callback, if `next === "/subscribe"` and a plan was set, the user is redirected to `/subscribe?plan=monthly`
4. The subscribe page creates a Stripe Checkout session (once Stripe is configured)

## Token refresh

The API client (`lib/api/client.ts`) checks `accessExpiresAt` before each request. If within 60 seconds of expiry, it proactively refreshes. On a 401, it attempts one refresh-and-retry cycle. Both paths update the session cookie with new tokens.

## Logout

`GET /auth/logout` reads the session, calls `POST /oauth/logout` on the API to revoke the refresh token, destroys the session cookie, and redirects to the marketing site.

## Cookies

| Cookie | Purpose | TTL |
|---|---|---|
| `tren_portal_session` | Encrypted session with tokens + user info | Session (browser close) |
| `tren_pkce` | Temporary PKCE verifier + state during sign-in | 15 minutes |
