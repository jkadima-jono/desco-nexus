# DESCO Nexus

A Desco Global platform connecting investors with structured project
opportunities in the Democratic Republic of Congo, and helping project sponsors
prepare information and coordinate diligence.

**This is a demonstration environment.** Accounts and transactions are
fictional. Projects reference real Desco Global initiatives, but nothing shown
is a securities offer. See `/trust` and `/legal` in the running app for the full
disclosure position.

## Status

| Area | State |
|---|---|
| Public site | Working — opportunities, project pages, pricing, trust, sponsors, investors |
| Sign-in | **Not functional in production** — see [Authentication](#authentication) |
| Database | PostgreSQL via Prisma 6 |
| Project images | Vercel Blob |
| Payments / invoicing | Not implemented; the commercial model is sales-assisted and described as a proposal |

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Prisma 6 · PostgreSQL ·
Tailwind CSS 4 · custom session auth (`jose`) · deployed on Vercel.

## Run locally

Requires Node 22+ and a PostgreSQL database. SQLite will not work: the schema
targets PostgreSQL, and serverless deployment has no persistent filesystem.

```bash
cd app
npm install
cp .env.example .env          # then fill in DATABASE_URL, DIRECT_URL, SESSION_SECRET
npx prisma generate
npx prisma db push            # create tables
npx tsx prisma/seed.ts        # seed demo projects
npm run dev                   # http://localhost:3000
```

`.env.example` documents every variable and which are required. Set
`DEMO_AUTH_ENABLED="true"` locally to get the demo persona buttons on `/login`;
they are refused in production by design.

## Checks

```bash
npm run typecheck   # tsc --noEmit
npm run test:unit   # sign-in token rules; no database needed
npm run build       # production build
npm run test:api    # integration tests; needs a running server and database
npm audit --omit=dev --audit-level=high
```

CI (`.github/workflows/ci.yml`) runs these against a throwaway PostgreSQL
service, plus smoke checks for the CSP header, robots, sitemap and cross-site
mutation rejection.

Do not run `npm audit fix --force` — it proposes downgrading Next.js to 9.3.3.
Transitive advisories are pinned with `overrides` in `app/package.json`.

## Deploy

The Vercel project's **Root Directory is `app`**, so deploy from the repository
root, not from inside `app/`:

```bash
npx vercel --prod          # from the repository root
```

Running it from `app/` resolves to `app/app` and fails. The project is not
connected to GitHub, so pushing to `main` does not deploy — deploys are manual.

Set `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET` and `BLOB_READ_WRITE_TOKEN`
in the Vercel project's environment variables before the first deploy.

## Authentication

There is no working sign-in path in production, deliberately.

- `/api/auth/demo` refuses whenever `VERCEL_ENV` is `production`, so demo
  personas can never be reached on a live deployment.
- `/api/auth/login` returns 410: this build does not verify email ownership.

The security-critical half of real email sign-in is implemented and unit-tested
(`app/src/lib/loginToken.ts`): 32-byte CSPRNG tokens, SHA-256 hashed at rest,
15-minute expiry, single-use via an atomic claim. `app/src/lib/mailer.ts` fails
closed — it never reports a send it did not perform.

To finish it, in order:

1. An email provider account (Resend, Postmark or AWS SES) and its API key.
2. A sending domain verified by SPF/DKIM DNS records.
3. A decision on who may sign in: open signup, or invite/allowlist only.
4. `sendViaProvider()` implemented in `mailer.ts`, then the
   `/api/auth/request-link` and `/api/auth/verify` routes and the `/login` UI.

Until then every authenticated area — mandates, deals, messages, data rooms,
admin — is unreachable in production.

## Layout

| Path | What |
|---|---|
| `app/` | The application |
| `app/src/app/` | Routes (App Router) |
| `app/src/lib/` | Domain logic: auth, authz, matching, plans, notifications, tokens |
| `app/prisma/schema.prisma` | Database schema |
| `app/tests/` | Integration and unit tests |
| `docs/` | Product, architecture, business model and roadmap documents |

## Background documents

These predate the current build and describe intent rather than shipped state.
Where they disagree with the code, the code is authoritative.

| Path | What |
|---|---|
| [docs/01-vision-strategy.md](docs/01-vision-strategy.md) | Vision, product strategy, market and competitive analysis |
| [docs/02-product.md](docs/02-product.md) | Personas, journeys, information architecture, permissions |
| [docs/03-architecture.md](docs/03-architecture.md) | Stack, backend, security, schema, API, auth |
| [docs/04-design-system.md](docs/04-design-system.md) | Tokens, typography, components, motion, accessibility |
| [docs/05-business-model.md](docs/05-business-model.md) | Business model, pricing, forecast, unit economics |
| [docs/06-gtm-growth.md](docs/06-gtm-growth.md) | Go-to-market, growth, acquisition |
| [docs/07-roadmap-execution.md](docs/07-roadmap-execution.md) | Roadmap, sprints, launch, scaling, risk |
| [docs/08-product-specification.md](docs/08-product-specification.md) | Master specification and feature specs |

---

desco.global | © 2026 Desco Global
