# 🛍️ Ku'isoko

A full-stack e-commerce test storefront wired end-to-end with **Stripe Checkout** — real payments, real webhooks, real order fulfillment. Built as a monorepo with a **NestJS** API and a **Next.js** storefront.

> ⚡ Live demo store, dark "Voltage" theme, 3D scroll hero, and a fully idempotent Stripe webhook pipeline underneath.

---

## 🔗 Live demo

**▶️ [ku-isoko-shop.vercel.app](https://ku-isoko-shop.vercel.app)**

The store runs in Stripe **test mode** — check out with the test card `4242 4242 4242 4242` (any future expiry, any CVC) to walk the full payment → webhook → fulfillment flow. No real charges.

> The frontend is deployed on **Vercel** and the NestJS API on **Render** (free tier — the API may take ~30–60s to wake on the first request after a period of inactivity).

---

## 📦 What's inside

This is a **pnpm workspace monorepo** with two apps:

| App | Path | Stack |
|---|---|---|
| 🧠 **API** | [`apps/api`](apps/api) | NestJS · TypeORM · PostgreSQL · Stripe |
| 🎨 **Web** | [`apps/web`](apps/web) | Next.js (App Router) · Tailwind CSS v4 · TypeScript · Zustand · Motion |

```
ecommerce-app/
├── apps/
│   ├── api/            # NestJS backend
│   │   └── src/
│   │       ├── products/    # Product + ProductVariant catalog
│   │       ├── cart/        # Cart + CartItem
│   │       ├── checkout/    # Stripe Checkout Session creation
│   │       ├── orders/      # Order fulfillment logic
│   │       ├── stripe/      # Stripe SDK wrapper
│   │       └── webhooks/    # Stripe webhook handler
│   └── web/             # Next.js frontend
│       └── src/
│           ├── app/         # Routes (home, checkout success/cancel)
│           ├── components/   # Navbar, ProductCard, CartDrawer, Footer, etc.
│           ├── store/        # Zustand cart store
│           └── lib/          # API client, checkout flow, helpers
├── docker-compose.yml    # Local Postgres
└── pnpm-workspace.yaml
```

---

## ✨ Features

- 🛒 **Product catalog & cart** — 15 seeded products, client-side cart (Zustand, persisted to `localStorage`) synced to a real backend cart at checkout time.
- 💳 **Stripe Checkout** — hosted checkout session created server-side, no card data ever touches this app.
- 🪝 **Idempotent webhooks** — `checkout.session.completed` fulfills the order (creates the `Order`, decrements stock, marks the cart converted); `checkout.session.expired` marks abandoned carts as expired. Both are safe against Stripe's at-least-once delivery — replays are no-ops.
- 🔐 **Signature-verified, raw-body webhooks** — via NestJS's native `rawBody: true`, verified to survive an actual production build (`nest build` → `node dist/main.js`), not just dev mode.
- 🌌 **Themed storefront UI** — dark "Voltage"/Ku'isoko theme, animated 3D scroll hero, a hover-reveal footer word, and a confetti burst on every button.
- 📱 **Responsive**, with device-emulation-aware fallbacks for effects that depend on real mouse hover.

---

## 🚀 Getting started

### Prerequisites

- Node.js + [pnpm](https://pnpm.io/)
- Docker (for local Postgres)
- A [Stripe](https://stripe.com) account (test mode) and the [Stripe CLI](https://stripe.com/docs/stripe-cli) for local webhook testing

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start Postgres

```bash
docker compose up -d
```

### 3. Configure environment variables

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

Fill in your Stripe **test-mode** keys in `apps/api/.env` — see the [Environment variables](#-environment-variables) section below.

### 4. Seed the database

```bash
cd apps/api && pnpm seed
```

### 5. Run everything

```bash
# terminal 1 — API (http://localhost:3000)
pnpm --filter api start:dev

# terminal 2 — Web (http://localhost:3001)
pnpm --filter web dev

# terminal 3 — forward Stripe webhooks to your local API
stripe listen --forward-to localhost:3000/webhooks/stripe
```

`stripe listen` prints a webhook signing secret (`whsec_...`) — copy it into `apps/api/.env` as `STRIPE_WEBHOOK_SECRET` and restart the API. This secret is **local-dev only** and rotates every time you restart the command — it's not what you'll use in production.

Open **http://localhost:3001**, add something to the cart, and check out with the Stripe test card `4242 4242 4242 4242` (any future expiry, any CVC).

---

## 🔑 Environment variables

### `apps/api/.env`

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `DATABASE_SSL` | `true` for managed Postgres (e.g. Supabase) that requires SSL; `false` for local Docker |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` locally, `sk_live_...` in prod) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret — from `stripe listen` locally, from the Stripe Dashboard in prod |
| `FRONTEND_URL` | The storefront's origin — used for CORS and Checkout Session `success_url`/`cancel_url` |
| `PORT` | Port the API listens on |

### `apps/web/.env.local`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the API the storefront talks to |

---

## 🧩 API reference

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/products` | List the product catalog with variants |
| `POST` | `/cart` | Create a cart from `{ items: [{ variantId, quantity }] }` |
| `GET` | `/cart/:id` | Fetch a cart |
| `POST` | `/checkout/session` | Create a Stripe Checkout Session for a cart, returns `{ url }` |
| `GET` | `/orders/by-session/:sessionId` | Look up an order by its Stripe session (used by the success page) |
| `POST` | `/webhooks/stripe` | Stripe webhook endpoint — signature-verified, raw body required |

---

## ☁️ Deploying

This app is deployed as **API → Render**, **Web → Vercel**, with **PostgreSQL on Supabase**.

### API (Render)

1. Create a **Web Service** pointed at `apps/api`, build command `pnpm install && pnpm build`, start command `pnpm start:prod`.
2. Set the environment variables from the table above — use a fresh **test** (or **live**) Stripe secret key, set `FRONTEND_URL` to your deployed Vercel domain, and `DATABASE_SSL=true` for Supabase.
3. Set `PORT` explicitly (e.g. `10000`); the API listens on `process.env.PORT` bound to `0.0.0.0` — already handled in `main.ts`.

### Web (Vercel)

1. Import the repo, set the project root to `apps/web`.
2. Set `NEXT_PUBLIC_API_URL` to your deployed Render API URL.

### Database (Supabase)

- Create a Supabase project and use its **connection pooler** string as `DATABASE_URL`.
- The schema is generated from the TypeORM entities; the app runs with `synchronize` off in production, so create the schema and seed once against the Supabase database before going live.

### 🪝 Don't forget the production webhook

`stripe listen` only works locally. Once the API is deployed:

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint** (in **test mode**).
2. Point it at `https://<your-api>.onrender.com/webhooks/stripe`.
3. Select at least `checkout.session.completed` and `checkout.session.expired`.
4. Copy the **new** signing secret Stripe gives you into Render's `STRIPE_WEBHOOK_SECRET` — it's different from any local `whsec_...` you've used so far.

---

## 🏗️ A few implementation notes

- **Cart lifecycle**: `open` → `converted` (paid) or `expired` (abandoned checkout). Both terminal states are guarded against being re-entered, so duplicate/out-of-order webhook deliveries are always safe no-ops.
- **Stock** only ever decrements on confirmed payment (`checkout.session.completed`) — never speculatively reserved at checkout time.
- **CORS** uses an explicit origin allowlist (`FRONTEND_URL` + `localhost:3001`) with `credentials: true` — never a wildcard, since browsers reject that combination outright.
