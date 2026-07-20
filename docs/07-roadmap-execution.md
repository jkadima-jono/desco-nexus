# DESCO Nexus — Roadmap, Execution & Risk

## 1. Product Roadmap (24 months)

**Q1 — Foundation (MVP build):** identity/orgs, listings, feed v1 (rules+embeddings), match actions, deal pipeline v1, messaging v1, data room v1, verification v1 (manual+vendor), web app. *Exit: 200 listings, 500 investors, first 50 intros.*

**Q2 — AI suite:** teaser/CIM/update generators, NL search, readiness coach, "why this match", EN/FR translation, mobile apps (Expo) beta. *Exit: activation +30%, first paid conversions.*

**Q3 — Deal infrastructure:** NDA/e-sign, diligence checklists, IC workspace, room analytics, calendar/meetings + AI summaries, notifications v2. *Exit: 10 deals reach diligence; first enterprise contract.*

**Q4 — Social & video:** reels, posts, follows, communities v1, events/webinars, creator tools. *Exit: DAU/MAU ≥ 25%, organic supply growth > curated.*

**Q5–Q6 — Monetize & govern:** billing all tiers, government portals (white-label), API v1, advisor marketplace beta, portfolio tracking. *Exit: $250k MRR.*

**Q7–Q8 — Scale:** ranking ML v2, fraud ML, data products/reports, second-region infra, SOC 2 Type II, marketplace GA. *Exit: Series A metrics ($4M ARR run-rate, 3 corridors dense).*

## 2. Sprint Plan (first 6 two-week sprints)
1. **S1:** monorepo, CI/CD, auth (passwordless), users/orgs schema, design tokens + primitives.
2. **S2:** listing model + editor, S3 uploads, seeker onboarding, seed 50 curated listings.
3. **S3:** feed v1 (structured filters + embedding sim), project detail, match actions, mandate setup.
4. **S4:** deals pipeline board, threads/messages (WS), notifications v1.
5. **S5:** data rooms (folders, grants, watermarked viewer, doc events), NDA template flow.
6. **S6:** verification vendor integration, admin console v0 (review queues), analytics events, closed-beta launch.

## 3. Engineering Roadmap & Team
- Y1 team (12): 2 platform/infra, 4 product eng (2 web, 1 mobile, 1 API), 1 AI eng, 1 data eng, 1 designer, 1 PM, 1 QA/SDET, 1 security/compliance (fractional→FT).
- Practices: trunk-based, feature flags, 80% coverage on domain modules, ADRs for irreversible choices, monthly game-days.
- Milestones: mo3 closed beta · mo6 public seeker self-serve · mo9 mobile GA + SOC2 Type I · mo12 API v1 + second region.

## 4. Launch Plan
- **Private beta (mo 3):** 50 listings × 100 investors, weekly cohort calls, concierge intros; success = 20 warm intros, NPS > 50.
- **Corridor launch (mo 6):** Kinshasa + Dubai events, government portal announcement, press (Bloomberg Africa, Jeune Afrique, The National); 1,000-investor waitlist release.
- **Public launch (mo 9):** self-serve open, launch report ("$XB of African opportunity, mapped"), Product Hunt/LinkedIn blitz, summit keynote.

## 5. Scaling & International Expansion
- Corridor playbook (repeatable): local GM + verification ops + 2 anchor government/DFI partners + 50 curated listings + investor roadshow ⇒ open corridor.
- Order: Africa core (Y1) → GCC + Francophone West Africa (Y2) → SE Asia + LatAm (Y3) → global (Y4+).
- Localization: FR (Y1), AR (Y2), PT/ES (Y3); data residency pods EU/Africa/GCC; per-market compliance review before success-fee activation.
- Org: regional pods (GM, sales, ops, moderation) on shared platform; 100M-user path = cell architecture + regional media pipelines (see architecture doc §9).

## 6. Risk Assessment & Mitigations

| Risk | L×I | Mitigation |
|---|---|---|
| Two-sided cold start | H×H | Single-player AI tools; curated concierge era; corridor density strategy |
| Regulatory (broker-dealer, marketing of securities) | M×H | Per-market legal review; fees via licensed partners; SaaS-first monetization; geo-fenced features |
| Fraud/scam listings destroy trust | M×H | Tiered verification, human review of first listing, ML fraud, insurance-backed "Verified" program, fast takedown SLA |
| Data-room breach | L×H | VDR hardening (arch §8), pentest, bug bounty, breach runbook, insurance |
| AI hallucination in financial docs | M×M | Draft-labeling, founder attestation gates, citation-anchored RAG, output policy filters |
| Incumbent response (PitchBook/LinkedIn feature-copy) | M×M | Emerging-market supply moat + trust graph they can't replicate quickly |
| Enterprise sales slower than plan | M×M | PLG revenue floor; partner channel; usage-based entry pricing |
| Key-person/geo concentration | M×M | Distributed team across hubs; document everything (ADRs, runbooks) |
| FX/payment friction in target markets | H×M | Multi-rail payments (Stripe+Paystack+wire), USD pricing, local-currency display |

## 7. AI Features Roadmap
- **Now:** generators (teaser/CIM/updates), NL search, match explanations, doc summarization, EN/FR translation.
- **Next (Y1–2):** deal assistant with tool use (compare, schedule, draft outreach), diligence Q&A over data rooms with citations, meeting summaries → CRM autologging, readiness auto-coach, interest prediction (which investors will respond).
- **Later (Y2–3):** valuation models per sector (comparables RAG), portfolio monitoring agents (news + filings watch), negotiation-prep briefs, auto-generated IC memos with dissent sections, voice-first assistant for founders in low-bandwidth markets.
- **Frontier (Y3+):** autonomous sourcing agents for funds (mandate → continuously screened pipeline), cross-lingual live deal rooms, simulation ("stress this project's cash flows").

## 8. Future Features (beyond core roadmap)
Secondary-market expressions of interest (regulated), syndicate formation (SPV rails via partners), escrow-backed milestone financing, insurance marketplace embedded in diligence, certification academy (Nexus Analyst), API app store (third-party diligence tools), sovereign data rooms for bilateral investment treaties, carbon/impact credit layer on ESG-verified projects.

## 9. Deployment Guide (MVP repo)
Prereqs: Node ≥ 20. `cd app && npm install && npm run dev` → http://localhost:3000. Production: `npm run build && npm start` (standalone output; Dockerfile-ready — `FROM node:20-alpine`, copy `.next/standalone`). Env vars (future backend): `DATABASE_URL`, `ANTHROPIC_API_KEY`, `S3_BUCKET`, `KYC_PROVIDER_KEY` — all via secrets manager, never committed.
