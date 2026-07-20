# Contributing to DESCO Nexus

## Setup

```bash
git clone git@github.com:jkadima-jono/desco-nexus.git
cd desco-nexus/app
npm install
npx prisma generate && npx prisma db push
npx tsx prisma/seed.ts && npx tsx prisma/seed-comments.ts && npx tsx prisma/seed-roles.ts
npm run dev        # http://localhost:3000 — use the demo-role sign-in buttons
```

No API keys are required. The AI teaser generator falls back to a
deterministic template unless `ANTHROPIC_API_KEY` is set in `app/.env`.

## Workflow

1. Branch from `main`: `git checkout -b feat/short-description`
2. Commit using Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
3. Open a pull request — CI must pass (type check, production build, integration tests)
4. One approving review before merge; squash-merge preferred

## Verifying your changes

```bash
cd app
npx tsc --noEmit                 # types
npm run build                    # production compile (stop the dev server first)
node --test tests/api.test.mjs   # integration suite (dev server must be running)
```

Never run `npm run build` while the dev server is running — they share
`.next/` and corrupt each other. Stop the server, build, restart.

## Ground rules

- **No secrets in the repo.** `.env`, databases, and uploads are gitignored; keep it that way. Configuration goes through environment variables.
- **Authorization lives in `app/src/lib/authz.ts`.** Never inline permission logic in routes or pages; extend the central policy.
- **Server-side enforcement first.** UI hiding is a courtesy; every protected action must be rejected by the API for unauthorized callers, with a test.
- **All user-facing system text goes through `app/src/lib/i18n.ts`** (EN/FR/ES/PT). Add keys for every new string.
- **Trust surfaces are sacred.** No invented verification states, no unexplained scores, AI output always labeled and review-gated.
- Follow the existing visual identity: charcoal navigation, restrained gold accents, white content cards (see `docs/04-design-system.md`).

## Architecture orientation

Read `docs/` in order — 01 vision → 03 architecture → 08 master spec.
The app is Next.js 15 (App Router) + Prisma/SQLite; schema in
`app/prisma/schema.prisma`; integration tests in `app/tests/`.
