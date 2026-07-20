# DESCO Nexus — The Operating System for Global Investment Opportunities

A Desco Global (Investdesco) platform. *Integrated Solutions. Sustainable Impact.*

## Contents

| Path | What |
|---|---|
| [docs/01-vision-strategy.md](docs/01-vision-strategy.md) | Executive vision, product strategy, market & competitive analysis, UVP |
| [docs/02-product.md](docs/02-product.md) | Personas, journeys, IA, screens, features, permissions, gamification |
| [docs/03-architecture.md](docs/03-architecture.md) | Stack, backend/AI/security/cloud architecture, DB schema + ER, API, auth |
| [docs/04-design-system.md](docs/04-design-system.md) | Tokens, typography, components, motion, accessibility |
| [docs/05-business-model.md](docs/05-business-model.md) | Business model canvas, pricing, 5-year forecast, unit economics |
| [docs/06-gtm-growth.md](docs/06-gtm-growth.md) | GTM, marketing/sales, growth loops, viral & referral, acquisition |
| [docs/07-roadmap-execution.md](docs/07-roadmap-execution.md) | Roadmap, sprints, launch, scaling, international, risk, AI roadmap |
| [docs/08-product-specification.md](docs/08-product-specification.md) | Master spec: deliverable map, first-class feature specs, marketplace logic, recommendation engine, compliance framework, KPIs, invented features |
| [docs/09-redesign-analysis.md](docs/09-redesign-analysis.md) | desco.global brand analysis, Our Pillars storytelling section strategy |
| [docs/10-fundcentre-expansion-strategy.md](docs/10-fundcentre-expansion-strategy.md) | Intralinks FundCentre analysis, gap analysis, Portfolio/Investor-CRM/Capital-Calls expansion plan (awaiting approval) |
| [app/](app/) | Production-grade MVP (Next.js 15 · React 19 · TypeScript · Tailwind 4) |

## Run the MVP

```bash
cd app
npm install
npx prisma generate && npx prisma db push   # SQLite schema (app/prisma/dev.db)
npx tsx prisma/seed.ts                      # seed demo data
npm run dev     # http://localhost:3000
npm run build   # production build (standalone output)
```

MVP screens: Discover feed · Project detail + data room · Flow Mode (swipe matching) · Deal pipeline · AI natural-language search · Secure messages.

**Auth, uploads, AI (sprint 3 slice):** Signed-cookie sessions (jose HS256, httpOnly, 7-day) with `/login` — demo passwordless: email identifies or creates the account; production swaps in magic-link/passkey delivery (docs/03 §7). Set `SESSION_SECRET` in production. Mutating APIs require a session (401 otherwise). Data rooms: `POST /api/documents` (multipart, 20MB cap, extension whitelist, server-generated storage keys under `app/uploads/`) and `GET /api/documents/:id` (authed download, traversal-guarded). AI: `POST /api/ai/teaser` calls Claude (`claude-sonnet-5`) when `ANTHROPIC_API_KEY` is set, deterministic labeled draft otherwise — button on every project page.

**Backend (sprint 1–2 slice):** Prisma + SQLite persistence (`app/prisma/schema.prisma`), seeded from `app/src/lib/data.ts`. API routes: `POST /api/match` (persists swipe; "interested" auto-opens a pipeline deal at Screening), `POST /api/messages` (persists messages), `GET /api/search?q=` (NL mandate parsing over the DB). Pages server-render from the database. Swap SQLite for Postgres by changing the Prisma datasource.

desco.global | © 2026 Desco Global
