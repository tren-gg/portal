# Deployment

## Platform

Deploy to Render or Vercel. Both auto-manage TLS once the custom domain is verified.

## Custom domain

Add a `portal` CNAME (or A/AAAA record depending on provider) pointing to the deployment host:

```
portal.tren.gg -> <render-or-vercel-host>
```

## Environment variables

Set these in the deployment platform's dashboard:

| Variable | Example | Notes |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://portal.tren.gg` | Must match the registered redirect URI |
| `MARKETING_URL` | `https://tren.gg` | For back-links and post-logout redirect |
| `TREN_API_URL` | `https://api.tren.gg` | Server-only, never exposed to browser |
| `TREN_API_CLIENT_ID` | `tren-portal` | Must match the registered OAuth client |
| `IRON_SESSION_PASSWORD` | (random 32+ char string) | Used to encrypt session cookies |
| `IRON_SESSION_COOKIE_NAME` | `tren_portal_session` | Cookie name |

Generate the session password:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Build

```bash
npm run build
npm start
```

Or use the platform's auto-build from the repo.

## DNS coordination

The marketing site lives at `tren.gg`. The portal lives at `portal.tren.gg`. The API lives at `api.tren.gg`. Each is a separate deployment with its own DNS record. Coordinate with whoever manages the `tren.gg` zone to add the `portal` subdomain record.
