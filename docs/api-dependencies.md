# API Contract

The portal talks to the Tren API through server-side requests only. Browser code
does not receive API access or refresh tokens.

## Public Configuration

Set `TREN_API_URL` to the public API origin:

```txt
TREN_API_URL=https://api.tren.gg
```

Local development can point this at a local API instance.

## Required Endpoints

The portal expects these API capabilities:

| Area | Capability |
|---|---|
| Auth | Start email sign-in, confirm magic link, exchange OAuth code, refresh token, logout |
| Account | Read current account and subscription summary |
| Devices | List, rename, and revoke devices |
| Billing | Create Checkout and Customer Portal sessions when Stripe is configured |
| Download | Create short-lived signed loader download URLs |

Stripe and download signing can be unavailable during early testing. In that
case, the portal displays the API error message and keeps the user on the
current page.
