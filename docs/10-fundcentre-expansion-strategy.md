# DESCO Nexus — Institutional Expansion Strategy
*Inspired by Intralinks FundCentre's enterprise fund-lifecycle model · Desco Global identity preserved · Planning only — no implementation until approved, per this brief's own instruction.*

## 0. How to read this document

This is the single consolidated answer to the 16-part Phase 9 request. It does not repeat what earlier docs already cover — it references them and adds only what's new. Existing coverage:

| Already answered | Where |
|---|---|
| Vision, personas, journeys, IA, feature hierarchy | [01](01-vision-strategy.md), [02](02-product.md) |
| Database schema, API design, security architecture | [03](03-architecture.md) |
| Design tokens, typography, components, motion | [04](04-design-system.md) |
| Business model, pricing | [05](05-business-model.md) |
| GTM, growth loops | [06](06-gtm-growth.md) |
| Roadmap, sprints, risk | [07](07-roadmap-execution.md) |
| Deep feature specs (DNA, Trust Score, fraud, valuation, negotiation workspace, compliance, KPIs) | [08](08-product-specification.md) |
| Storytelling layer, pillar pages, brand-consistency system | [09](09-redesign-analysis.md), `app/src/lib/theme.ts` |

This document's job: fold in what FundCentre does that Nexus genuinely lacks — the **fund-administration and LP-servicing layer** — without diluting what already works.

## 1. Research: FundCentre, distilled

Visited live (this session). What it actually is: not a marketplace — a **fund-lifecycle operations platform** for GPs servicing LPs, built around four stages sold as one connected wheel: *Fundraising → Onboarding → Investor Reporting → Managed Services*.

**Positioning:** proof-by-scale, not story. Hero leads with numbers — 515,000 professionals, 100,000 organizations, "$1 out of every $2 raised globally," $35T+ in transactions — before any product description. Trust is quantitative, not narrative.

**IA pattern:** one product, four lifecycle stages, each a card with: stage name → one-line promise → 3 concrete capability bullets → single "Find out more" link. No feature-soup lists; everything is grouped by *which point in the fund lifecycle it serves*.

**Visual system:** navy/blue enterprise palette, generous dark hero space, a radial "hover to explore" diagram connecting the four stages visually (lifecycle-as-wheel, not funnel), logo trust-bar, minimal color — restraint reads as institutional.

**Capabilities implied by the four stages** (the real product substance):
- *Fundraising*: purpose-built LP-facing portal, interest tracking across funds, integrated CRM
- *Onboarding*: auto-generated subscription packages, guided step logic, real-time document-status tracking
- *Investor Reporting*: on-demand reporting portal, white-label branding per GP, ILPA-standardized templates
- *Managed Services*: human-assisted data sourcing/formatting/publishing — the platform admits some things aren't worth self-serve automating yet

**What this maps to for Nexus:** FundCentre is GP↔LP fund administration; Nexus is investor↔opportunity discovery and deal execution. The overlap is real but partial — Nexus should adopt the *lifecycle-stage IA pattern* and the *reporting/onboarding rigor*, not become a fund administrator. Desco Global itself is not a fund administrator; it is an operator/developer raising capital for real assets. The correct synthesis: Nexus needs a **post-close fund/portfolio servicing layer** for the investors who *have* committed capital — because right now that stops at "deal closed."

## 2. Gap analysis: Nexus today vs. FundCentre's lifecycle depth

| Lifecycle stage | Nexus has | FundCentre-grade gap |
|---|---|---|
| Fundraising / discovery | Discover feed, Match, AI search, teaser generation — **strong, arguably ahead** (video/social layer FundCentre lacks entirely) | Investor-CRM view for sponsors (who's viewed, who's warm) — missing |
| Onboarding (NDA→commit) | NDA mention, data room, comments — **thin** | No guided subscription flow, no document-status tracker, no e-sign, no capital-call mechanics |
| Investor reporting (post-close) | **Does not exist** — deal workspace stops at "Closing" stage | No LP-facing reporting portal, no capital calls/distributions, no ILPA-style standardized statements, no portfolio-level (multi-deal) investor view |
| Managed services | N/A (not Nexus's model — Desco is principal, not administrator) | Correctly out of scope — do not build |
| Fund/portfolio administration | Single-deal workspace only | No "fund" or "vehicle" entity above individual deals; no capital account, no NAV/valuation roll-up |
| Investor CRM | None | No contact/relationship tracking for sponsors across an investor's engagement history |
| Compliance/audit | Audit log exists (hash-chained, doc 03) | No LP-facing compliance status display, no retention/legal-hold UI |
| White-label/branding | None | Government portal concept exists in docs (07) but not built |

**Priority-ranked gaps** (impact × buildability, given Nexus's actual business model — not FundCentre's):
1. **Investor Reporting Portal** (post-close, per-investment) — closes the single biggest hole; every closed deal currently goes dark
2. **Investor CRM for sponsors** — makes the fundraising side match FundCentre's depth; sponsors currently have zero visibility into investor engagement
3. **Capital Calls & Distributions** — mechanical but essential once "closed" deals need real cash-flow tracking
4. **Portfolio-level view** (all an investor's positions, one place) — currently only single-deal workspaces exist
5. **Guided onboarding/subscription flow** — NDA→data room today is manual; FundCentre-style guided steps reduce friction
6. Everything else in the Phase 4 wishlist (AI assistant, maps, watchlists, etc.) is either **already built** (AI search, teaser gen, comments/social) or **already specified** in doc 08 (Smart Introductions, Trust Score, DD Marketplace, Capital Stack viz, Relationship Intelligence) — restating it here would be noise, not progress.

## 3. Redesign strategy — what stays, what elevates

**Non-negotiable — preserved exactly:** African identity and pillar structure (Agri/Phar/Water/Invest + extensions), impact/ESG-first framing, Desco brand system (charcoal/gold, Montserrat/Open Sans), the social/video discovery layer (Nexus's genuine advantage over FundCentre, which has none of it).

**Elevated to institutional-grade**, borrowing FundCentre's *pattern*, not its pixels:
- **Proof-by-numbers header band** on Discover and the Pillars index: live Capital Connected, active investors, closed-deal count — quantitative trust to sit alongside the narrative trust already built (docs 09). Numbers must be real platform metrics, never invented (per this session's standing rule against fake trust claims).
- **Lifecycle-stage IA** for the new investor-facing surfaces: Discover → Match → Data Room/NDA → **Portfolio** → **Reporting**, mirroring FundCentre's stage-card pattern for the *new* screens only — existing screens keep their proven layout.
- **Reporting rigor**: once a deal closes, the investor gets a dedicated reporting home per position — capital called, capital returned, current carrying value, sponsor updates timeline — not a dead deal-workspace.

## 4. Information architecture additions

```
Nexus (existing IA unchanged — see 02 §3)
└── Portfolio (NEW — investor-only, post-authentication)
    ├── Overview — all positions, committed vs. called vs. distributed, roll-up chart
    ├── /portfolio/[dealId] — Position detail
    │   ├── Capital account (calls, distributions, running balance)
    │   ├── Reporting — sponsor updates timeline (extends existing Deal model)
    │   ├── Documents — capital call notices, distribution notices, statements
    │   └── Performance — called/returned/current value, simple multiple
    └── Statements — exportable per-period summary (CSV; PDF is Phase 2)

Sponsor-side (NEW — owner/admin role only)
└── /sponsor/investors (Investor CRM)
    ├── Engagement list — every investor who viewed/saved/messaged this sponsor's listings
    ├── Pipeline view — by stage, mirrors existing Deals board but sponsor-scoped
    └── Contact history — thread + meeting log per investor relationship
```

## 5. Database changes required

Additive only — no breaking changes to existing models (`Listing`, `Deal`, `User`, `Organization` unchanged).

```prisma
model CapitalCall {
  id          String   @id @default(cuid())
  dealId      String
  deal        Deal     @relation(fields: [dealId], references: [id])
  callNumber  Int
  amountUsd   Int
  purpose     String
  noticeDate  DateTime
  dueDate     DateTime
  status      String   @default("issued") // issued|paid|overdue
  paidAt      DateTime?
}

model Distribution {
  id          String   @id @default(cuid())
  dealId      String
  deal        Deal     @relation(fields: [dealId], references: [id])
  amountUsd   Int
  kind        String   // return-of-capital|profit|interest
  paymentDate DateTime
}

model PortfolioUpdate {
  id        String   @id @default(cuid())
  dealId    String
  deal      Deal     @relation(fields: [dealId], references: [id])
  authorId  String   // sponsor user posting the update
  title     String
  body      String
  period    String   // "Q3 2026" etc — for reporting-cadence grouping
  createdAt DateTime @default(now())
}

model InvestorEngagement {
  // Denormalized read-model for the sponsor CRM view — derived from
  // existing MatchAction + Comment + Message rows, not a new source of
  // truth, refreshed on write (mirrors existing audit-log pattern).
  id         String   @id @default(cuid())
  sponsorOrgId String
  investorId String
  listingId  String
  lastActivity DateTime
  stage      String   // viewed|saved|nda|room-access|messaged|committed
}
```

Migration path: `prisma db push` (SQLite, dev) → same models port to Postgres unchanged when the production datasource swap happens (per doc 03 §9).

## 6. API additions

- `GET/POST /api/portfolio` — investor's positions (session-scoped, same authz pattern as `/api/deals`)
- `GET /api/portfolio/[dealId]` — position detail, capital account roll-up
- `POST /api/deals/[id]/capital-calls` — sponsor-only (reuses `canManageListing` policy from `authz.ts`)
- `POST /api/deals/[id]/distributions` — sponsor-only
- `POST /api/deals/[id]/updates` — sponsor-only, investor-readable
- `GET /api/sponsor/investors` — sponsor-only CRM read, built from `InvestorEngagement`

All new endpoints follow the existing rule: server-side session check first, role check second, 401/403 before any data touches the response — same pattern already tested in `tests/api.test.mjs`.

## 7. Component architecture additions

New, reusing existing primitives (`Reveal`, `StatCounter`, `Timeline` from `components/story/`):
- `PortfolioSummaryCard` — position tile (committed/called/distributed/value)
- `CapitalAccountLedger` — table component, calls+distributions chronological
- `StageWheel` — the one FundCentre-inspired visual: a radial or horizontal lifecycle indicator (Discover→Match→Room→Portfolio→Reporting) used as a persistent orientation cue on investor-facing pages — original geometry/iconography, not a copy of Intralinks' wheel graphic
- `InvestorEngagementRow` — sponsor CRM list row
- `ProofBar` — the quantitative trust strip (real metrics only, queries the DB, never hardcoded)

## 8. Design system deltas

No new palette — `src/lib/theme.ts` tokens already cover this. Additions: a `status.` semantic set for capital-call states (issued=charcoal, paid=emerald, overdue=brandred) and a numeric "ledger" table style (tabular-nums, right-aligned amounts) for `CapitalAccountLedger` — the one genuinely new component category this expansion requires.

## 9. Content direction (Phase 5)

Executive, institutional register — same voice already established in docs 09's pillar copy. New surfaces need it too:
- Portfolio empty state: *"No positions yet. Positions appear here once a data-room request converts to a closed commitment."* — factual, not aspirational filler.
- Capital call notice language: formal, dated, numbered — matches real GP↔LP capital-call conventions, not marketing tone.
- Sponsor CRM: internal tool tone — terse, data-forward, no persuasive copy (it's a working screen, not a landing page).

## 10. Prioritized backlog (dependency-ordered)

1. Schema additions (§5) + migration
2. `authz.ts` policy extensions for capital-call/distribution/update write access (sponsor-only, deal-scoped)
3. Portfolio API routes + investor-facing `/portfolio` pages
4. `CapitalAccountLedger` + `PortfolioSummaryCard` components
5. Sponsor Investor CRM (`InvestorEngagement` read-model + `/sponsor/investors` page)
6. `ProofBar` on Discover/Pillars using real aggregate queries
7. `StageWheel` orientation component across investor surfaces
8. Integration tests: capital-call authz (sponsor-only, cross-org denial), portfolio session-scoping, distribution math
9. Everything from the Phase 4 wishlist not covered above is **already specified in doc 08** — pull from that backlog rather than re-scoping here.

## 11. What this deliberately does not do

- Does not rebuild Nexus as a fund administrator (wrong business model for Desco Global — Desco is a principal/operator, not a third-party fund admin like Intralinks' actual customers).
- Does not add a "Managed Services" human-ops product — that's Intralinks' business model, not an investment-platform feature.
- Does not touch the working Discover/Match/Deals/Search/Messages surfaces — they're ahead of FundCentre in social/AI terms already; this expansion is additive.
- Does not fabricate the `ProofBar` numbers — it queries real `Deal`/`MatchAction` counts or the section doesn't ship.

---

**Per this brief's own Phase 9 instruction: implementation begins only after this is approved.** Say which numbered backlog item(s) to build first, or "all of it" for the full sequence.
