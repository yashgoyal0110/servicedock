# ServiceDock

ServiceDock is a SaaS app for local service operators — repair shops, field
teams, cleaners, maintenance businesses — to publish live service catalogs,
location pages, QR links, and customer-facing pricing from one dashboard.

## Stack

- **Backend:** Express + TypeScript REST API (`server/`)
- **Frontend:** React 19 + Vite SPA (`client/`)
- **Auth:** custom email/password with JWT (httpOnly cookie)
- **ORM:** Prisma + PostgreSQL (shared schema in `prisma/`)
- **Uploads:** local-disk storage (logo/banner), served by Express
- **Integrations:** Mapbox (address search), MercadoPago (billing), Gemini (AI catalog import)
- **Deploy:** single Docker image (Express serves the SPA + `/api`) + Docker Compose

This is a pnpm workspace: `server` and `client` are packages sharing the root
Prisma client.

## Features

- Email/password accounts (register/login/logout), JWT sessions
- Multi-location (store) management with a configurable free-plan limit
- Service/product management with prices, categories, descriptions
- Logo/banner image uploads per location
- Address autofill via Mapbox Search Box
- AI-assisted catalog import from an uploaded image/PDF (Gemini)
- Public, shareable store pages by city + slug, with QR codes
- MercadoPago subscription checkout, cancel, and webhook handling

## Local development

```bash
pnpm install
cp .env.example .env          # fill in DATABASE_URL, JWT_SECRET (>=16 chars)
pnpm prisma:generate
pnpm prisma:migrate           # apply migrations to your dev DB
pnpm run seed                 # optional sample data

# two terminals:
pnpm dev:server               # API on :3000
pnpm dev:client               # SPA on :5173 (proxies /api and /uploads -> :3000)
```

## Docker deployment (single container + Postgres)

```bash
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env    # required
docker compose up --build
```

The compose stack includes:

- `app`: one container — Express serves the built React SPA **and** the `/api`
  routes — exposed on host port `4001`. Runs `prisma migrate deploy` on startup.
- `db`: PostgreSQL 16 with a persistent volume.
- `servicedock_uploads` volume mounted at the uploads dir so images persist.

Optional integration keys (`MAPBOX_TOKEN`, `MP_ACCESS_TOKEN`,
`MP_WEBHOOK_SECRET`, `GEMINI_API_KEY`) can be set in `.env`; features that lack
their key degrade gracefully (return a clear error) instead of crashing. See
`.env.example` for the full list.

## Caddy (public URL / TLS)

The app is fronted by Caddy on the host, which terminates TLS and reverse-proxies
to the container on port `4001`. The site block lives in the project `Caddyfile`:

```caddy
servicedock.8.229.88.229.sslip.io {
  reverse_proxy 127.0.0.1:4001
}
```

Add/keep this block in your Caddy config and reload Caddy (`caddy reload` or
`systemctl reload caddy`). The container port (`4001`) is unchanged from before,
so the existing Caddy setup keeps working — same URL, same port.
