# Tren Portal

Authenticated web portal for Tren account management. Sign-in, dashboard, devices, billing, and loader download.

This is the account-management surface for signed-in users. The marketing site lives separately at `tren.gg`.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                   # http://localhost:3000
```

Requires the Tren API running on localhost:3001. See [docs/setup.md](docs/setup.md) for full instructions.

## Documentation

See [docs/README.md](docs/README.md) for the full documentation index:

- [Setup](docs/setup.md) - Local development
- [Auth](docs/auth.md) - OAuth flow and session management
- [API Dependencies](docs/api-dependencies.md) - API changes needed for full functionality
- [Pages](docs/pages.md) - Per-page reference
- [Deployment](docs/deployment.md) - Production deployment
- [Conventions](docs/conventions.md) - Code style and patterns
