# Migration status: Next.js → Express + React (COMPLETE)

The app was converted from Next.js to a standalone **Express (TypeScript) API +
React (Vite) SPA**, deployed as a single Docker image. The Next.js app has been
removed. Auth is custom JWT (Clerk removed); public store pages are
client-rendered (no SSR/SEO).

## Ported features

| Feature | Server | Client |
|---|---|---|
| Auth (register/login/logout/me, JWT) | `routes/auth.ts` | `context/auth.tsx`, `pages/Login`, `pages/Register` |
| Locations (stores) CRUD + plan limit | `routes/stores.ts`, `lib/limits.ts` | `pages/Stores` |
| Products/services CRUD + limit | `routes/products.ts` | `pages/StoreDetail` |
| Image uploads (logo/banner) | `routes/uploads.ts` (multer/local disk) | `components/UploadImage` |
| Mapbox address search | `routes/mapbox.ts` | `components/AddressSearch` |
| Billing (MercadoPago) + webhook | `routes/billing.ts`, `lib/mercadopago.ts` | `pages/Billing` |
| AI catalog import (Gemini) | `routes/import.ts`, `lib/ai-schema.ts` | `components/ImportMenuDialog` |
| Public store pages + QR | `routes/public.ts` | `pages/PublicCity`, `pages/PublicStore`, `components/StoreQr` |

## Verified

- `pnpm typecheck` and `pnpm build` pass for both workspaces.
- Server boots; `/api/health` 200; auth-gated routes 401; SPA fallback serves
  the React app; MercadoPago webhook 200 with the documented "no secret" warning.

## NOT verified end-to-end (needs live services this environment lacks)

- **Full DB flows** (register → create 5 locations → 6th blocked, products,
  public pages) — needs a running Postgres. `docker compose up` provides one.
- **Docker image build** — Docker daemon was unavailable; each stage was
  verified in isolation. Run `docker compose up --build`.
- **Mapbox** — needs `MAPBOX_TOKEN`.
- **MercadoPago** checkout/webhook/signature — needs `MP_ACCESS_TOKEN` +
  `MP_WEBHOOK_SECRET` and a public webhook URL (`.../api/billing/webhook`).
- **Gemini import** — needs `GEMINI_API_KEY`. Note the model id
  (`gemini-3.5-flash`) was ported verbatim from the old code; change it in
  `server/src/routes/import.ts` if that id is invalid at runtime.

## Behavior changes worth knowing

- Uploads use **local disk** (not UploadThing). Persist them with a Docker
  volume at the uploads dir (compose does this).
- Public store prices render as whole currency units (Prisma `Int`); if prices
  are actually stored as cents, adjust formatting in `pages/PublicStore.tsx`.
- Pro plan `storeLimit` (3) is currently **below** the free limit (5) — see
  `server/src/config/plans.ts`. Bump Pro when you decide the number.
