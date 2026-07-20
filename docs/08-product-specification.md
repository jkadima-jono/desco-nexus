# DESCO Nexus — Master Product Specification
*The operating system for global private capital. Consolidates and extends docs 01–07.*

## 0. Deliverable Map

This specification set covers all 27 requested deliverables. Items marked → are specified in an earlier document; everything else is specified here.

| # | Deliverable | Where |
|---|---|---|
| 1–2 | Vision, mission, product strategy | → [01-vision-strategy.md](01-vision-strategy.md) |
| 3, 18 | Platform & technical architecture | → [03-architecture.md](03-architecture.md) §1–2, 9 |
| 4–6 | Personas, journeys, feature hierarchy | → [02-product.md](02-product.md) §1–2, 5 |
| 7–10 | Mobile/desktop design, navigation, IA | → [02-product.md](02-product.md) §3–4; [04-design-system.md](04-design-system.md); Flow/Desk dual-mode model |
| 11 | Database architecture | → [03-architecture.md](03-architecture.md) §3 |
| 12 | AI architecture | → [03-architecture.md](03-architecture.md) §4–5; extended in §2–4 below |
| 13 | Marketplace logic | **§5 below** |
| 14 | Recommendation engine | **§6 below** |
| 15 | Security architecture | → [03-architecture.md](03-architecture.md) §7–8 |
| 16 | Compliance framework | **§7 below** |
| 17 | Monetization strategy | → [05-business-model.md](05-business-model.md) |
| 19 | API design | → [03-architecture.md](03-architecture.md) §6 |
| 20–24 | Roadmap, MVP, phases, long-term | → [07-roadmap-execution.md](07-roadmap-execution.md); MVP is running code in `app/` |
| 25 | Competitive differentiation | → [01-vision-strategy.md](01-vision-strategy.md) §4; sharpened in §9 below |
| 26 | Risks and mitigation | → [07-roadmap-execution.md](07-roadmap-execution.md) §6 |
| 27 | Success metrics and KPIs | **§8 below** |
| — | First-class feature specs | **§1–4 below** |
| — | Invented features | **§10 below** |

## 1. First-Class Feature Specifications

Each feature below is a product, not a page: it has its own problem statement, data model hooks, AI loop, and revenue attachment.

### 1.1 Investment DNA
**Problem.** Mandates and pitch profiles are static self-descriptions; behavior tells the truth. Investors say "sector-agnostic" then pass on everything outside fintech.
**Design.** Every investor and project carries a living AI profile with two layers: *declared* (what they wrote) and *revealed* (what they do — swipes, dwell time, diligence requests, closed deals, response patterns). The DNA card shows sector gravity, ticket distribution, geography heat, risk posture, ESG weight, governance expectations, decision speed, and a declared-vs-revealed divergence indicator ("You say Series A–B; 80% of your interest is pre-A").
**AI loop.** Embedding built from mandate text + action history, refreshed weekly; divergence computed as distance between declared and revealed vectors. DNA powers matching (§6), Smart Introductions (1.2), and Shadow IC (§10).
**Guardrail.** Revealed layer is private by default; users choose what to publish. Never shown to counterparties without consent — trust surface, not surveillance.
**Revenue.** DNA analytics in Investor Pro; anonymized aggregate DNA feeds the data product.

### 1.2 Smart Introductions
**Problem.** Cold outreach is the tax everyone pays; response rates under 5% waste both sides' time.
**Design.** Weekly, the platform proposes a small number of high-conviction introductions (3 for investors, 2 for seekers) with a written rationale: complementary DNA, network overlap, portfolio adjacency, timing signals ("their fund entered deployment phase last month"). Both sides accept before contact opens — double-opt-in makes every conversation warm. Declining teaches the engine.
**Why scarcity.** Capped intros preserve signal value and protect senior people from spam — the product is *fewer*, better conversations. (Behavioral principle: scarcity + explanation drives 3–5x acceptance vs. open messaging.)
**Revenue.** Intro quota scales with tier; success-fee attribution starts at accepted intro.

### 1.3 Trust Score & Reputation Marketplace
**Problem.** In cross-border private markets, trust is the binding constraint; references are slow, unverifiable theater.
**Design.** Composite 0–100 score from: verification tier (identity, company, accreditation, government), counterparty-confirmed transaction history, responsiveness (median reply, follow-through rate), diligence conduct (did they open the data room they requested?), post-deal peer reviews across six axes (professionalism, governance, communication, transparency, execution, reliability), and compliance standing. Score decays without activity; single bad review cannot crater it (median-of-axes, volume-weighted).
**Hard rules.** Not purchasable, not gameable by volume (only counterparty-confirmed events count), fully explainable — every user sees exactly what moves their score and can appeal through human review. Reviews unlock only after a confirmed transaction, both directions simultaneously (no retaliation editing).
**Revenue.** None directly — deliberately. Monetizing trust corrupts it; it monetizes indirectly through everything else.

### 1.4 AI Fraud Detection
**Problem.** One convincing fake listing in a frontier market destroys platform credibility permanently.
**Design.** Screening pipeline on every listing, document, and identity: financial-statement anomaly detection (Benford deviations, impossible margins vs. sector priors), duplicate-project detection (embedding similarity across listings, image reverse-search on site photos), projection sanity checks vs. comparable base rates, document forensics (metadata, template fingerprints, AI-generation detection), identity-graph anomalies (device/network clustering, velocity), and reputation-pattern anomalies (review rings). Output is a risk tier routed to human compliance review — AI flags, humans decide; users are never auto-convicted by a model.
**KPI.** Confirmed-fraud rate reaching investors < 0.1% of listings; median flag-to-review < 4h.

### 1.5 Secure Deal Rooms + Negotiation Workspace
Extends the shipped VDR (§3 in architecture; working v1 in `app/`). Full workspace per deal: pitch materials, financial models, data room with versioning and per-document analytics, AI summaries with page-anchored citations, deal chat, video meetings, live co-editing on term sheets with tracked versions, offer tracker (every bid/counter logged), side-by-side term-sheet comparison (AI normalizes to a standard term grid: valuation, liquidation prefs, governance, vesting, exclusivity), approval workflows against each side's IC process, and e-signature completion. The deal timeline is the spine: every artifact, message, and decision hangs off one auditable chronology.
**Why it wins.** Incumbent VDRs store documents; Nexus owns the *negotiation state*. Term-comparison alone replaces hours of associate work per round.

### 1.6 Video Pitch Feed & Project Stories
90-second structured pitch videos (AI-assisted script from listing facts; teleprompter capture in-app) in a vertical feed with overlay actions (interested / save / data room). Stories: milestone updates — permits, construction footage, customer wins, hires — that accrue to the listing's permanent timeline and count toward Proof-of-Progress (§10.2). Feed ranking follows §6; every reel carries the verified badge state and links one tap deep to full diligence — entertainment surface, institutional substance.

### 1.7 Portfolio Monitoring
Post-close, the deal room converts to a monitoring room: operational KPI dashboards (sponsor-reported, format-enforced), ESG metrics, milestone tracking against the investment case, board packs, financial reporting with AI variance commentary ("revenue 12% under plan; driver: delayed plant commissioning — flagged in March update"), media/news watch, and AI early-warning signals (reporting delays, KPI drift, sentiment shifts). Investors get one portfolio home across all Nexus deals — the retention product that makes leaving expensive.
**Revenue.** Portfolio subscriptions; sponsor-side reporting tools in Professional tier.

### 1.8 Due Diligence Marketplace
Verified advisors (lawyers, auditors, engineers, ESG specialists, valuation firms) listable with jurisdiction, sector, credentials, and reviewed track record. Investors hire directly inside the deal room; scoped engagements with milestone payments through platform escrow partners; work product lands in the data room with provenance. AI drafts the scope from deal context ("Zambian water utility, blended structure → local regulatory counsel + tariff specialist + technical engineer").
**Revenue.** 10–15% take rate; advisor Pro subscriptions.

### 1.9 AI Risk Analysis & AI Valuation
**Risk.** Auto-generated report per listing: financial (leverage, concentration, runway), political/country (sovereign indicators per corridor), currency exposure, customer concentration, governance gaps, legal status, operational, climate/ESG. Each risk cites its evidence in the data room and gets sponsor right-of-reply — the report shows both.
**Valuation.** From uploaded financials: DCF scaffold + comparable companies + comparable transactions (Nexus's own closed-deal corpus becomes the moat data source over time), exit scenarios, dilution modeling, sensitivity grids, implied investor returns. Always labeled as analytical starting point, never as advice (compliance line, §7); every number traceable to inputs.
**Revenue.** Included in Investor Pro; per-report credits for lower tiers.

### 1.10 AI Readiness Coach & DD Assistant
Coach (partially shipped as readiness scoring + teaser generator): pre-publication review producing a gap list with one-tap fixes — deck critique against sector norms, missing financial statements, governance red flags, legal document checklist per jurisdiction and instrument. Listings publish with a readiness score; below-threshold listings get coached, not blocked.
DD Assistant: generates diligence questionnaires customized by industry, geography, instrument, and structure; tracks answers into the deal room; flags unanswered high-severity items at each stage gate.

### 1.11 Conference Mode
Event layer for summits and investor days: opt-in proximity discovery (venue-scoped, time-boxed, off by default — privacy first), AI meeting recommendations from DNA fit among attendees, instant scheduling against synced calendars, post-event follow-up packets (met-list with context + suggested next steps). Sells as event sponsorship + organizer licensing; doubles as the government product's investor-day engine.

### 1.12 Capital Stack Visualization & Relationship Intelligence
**Capital stack.** Interactive structure diagram per deal — tranches (senior/mezz/equity/grant), committed vs. sought, per-tranche terms, waterfall simulation with draggable assumptions. Replaces the spreadsheet screenshot every infrastructure deck contains.
**Relationship intelligence.** Graph over investors, founders, advisors, institutions, and deals: co-investment history, board seats, advisor overlaps, path-finding ("strongest warm path to this fund runs through your co-investor on Atlas Solar"). Edges built only from platform-native confirmed events + user-consented imports — no scraped shadow profiles.

## 5. Marketplace Logic

**Structure.** Two-sided core (capital ⇄ opportunities) with a third professional-services side attached at the diligence stage — the highest-intent moment, which is why the marketplace attaches there and not at browse time.

**Liquidity strategy.** Depth over breadth: a corridor opens only with 50+ curated listings and 100+ verified investors (playbook in 07 §5). Supply quality is gated (readiness threshold + verification), demand is gated (verification tiers) — curation is the product in the early era; the feed inherits quality later.

**Matching allocation.** Not a pure auction. Sponsored placement exists but is capped per feed session, always labeled, and cannot displace top organic matches — long-term trust beats short-term yield. Intro capacity is the scarce unit; premium tiers buy more capacity, not better placement.

**Pricing logic.** Subscriptions price access and tooling (predictable, compliant everywhere); success economics price outcomes (via licensed partners, jurisdiction-gated); the marketplace prices expert time (take rate). Data products price the aggregate exhaust. No listing fees — supply-side friction is the enemy in the cold-start era.

**Cold-start sequence (proven pattern, applied per corridor).** (1) Single-player AI tools give seekers value with zero network. (2) Desco + government pipelines seed credible supply. (3) Concierge era hand-delivers investor value. (4) Growth loops A–E (06 §4) take over. Every corridor repeats the same ladder.

**Disintermediation defense.** Platform leakage is inevitable in high-trust deals; fight it with value, not walls — the deal room, DD marketplace, e-sign, and portfolio monitoring make staying on-platform cheaper than leaving, and track-record accrual (the industry CV) only counts platform-confirmed closes.

## 6. Recommendation Engine

**Objective function.** Ranked blend per user: P(meaningful engagement) × deal-quality prior × diversity/freshness adjustments, where "meaningful" = data-room request or accepted intro, not clicks. Optimizing shallow engagement is explicitly rejected — this is a marketplace, not an ad network; the target is closed capital, and the proxy chain (swipe → room → intro → close) is validated quarterly against actual closes.

**Signals.** Declared mandate; revealed DNA (1.1); collaborative signals (investors with similar action histories); listing quality (readiness, verification, sponsor responsiveness); freshness; corridor supply-demand balance (thin-side boosting); negative signals (passes decay a sector's weight, hard-blocks respected permanently).

**Architecture (implements 03 §4).** Stage 1: ANN candidate retrieval over listing embeddings (pgvector HNSW, top-500). Stage 2: learned re-ranker — gradient-boosted trees at launch (interpretable, cheap, small-data-friendly), transformer ranker when interaction volume supports it. Stage 3: business-rule layer — visibility permissions, compliance geo-gates, sponsored-slot caps, diversity constraints (max 2 same-sector consecutive), per-session novelty budget.

**Explainability contract.** Every recommendation renders "why": top contributing features translated to natural language. Non-negotiable — institutional users won't trust a black box, and explanations double as mandate-refinement UI (tap a wrong reason to correct the engine).

**Feedback cadence.** Online: session actions update short-term user state immediately. Weekly: re-ranker retrains on swipe→room→intro→close funnels. Quarterly: offline evaluation against realized deal progression; feature-weight drift review.

**Cold-start.** New investor: mandate interview + DNA transfer from firm type priors + first-session calibration deck (10 diverse cards). New listing: content-based match on embedding + readiness boost + small exploration budget (guaranteed impressions to seed signals).

## 7. Compliance Framework

**Regulatory posture.** Nexus operates as a communications, workflow, and data platform — not a broker-dealer, exchange, or adviser — until per-jurisdiction licensing deliberately changes that. Three consequences: success fees flow only through licensed partners (introducing-agent agreements) or licensed Nexus subsidiaries; AI outputs are analytical tools with mandated disclaimers, never recommendations to transact ("suitability language" linting on all AI surfaces); listing visibility respects private-placement marketing rules per viewer jurisdiction (geo-gating engine: a US retail-tier user cannot see offers that would constitute general solicitation; verified accredited/institutional tiers unlock accordingly).

**KYC/AML tiers.** T0 browse-public (email only) → T1 identity-verified (vendor eKYC: document + liveness) → T2 accredited/qualified (jurisdiction-appropriate attestation + evidence) → T3 institutional (entity KYB, UBO mapping, sanctions/PEP screening) → T-Gov (bilateral agreement + diplomatic verification). Screening reruns on schedule and on watchlist updates; adverse hits freeze transaction features pending review. All KYC artifacts envelope-encrypted, compliance-role access only, never in general storage (03 §8).

**Data protection.** GDPR/CCPA from day 1: consent registry, DSR endpoints, retention schedules, DPO function. Regional data pods (EU/Africa/GCC) for residency; government-tier customers can mandate in-country storage. Cross-border transfer via SCCs; POPIA (SA), NDPA (Nigeria), Morocco 09-08 tracked per corridor entry checklist.

**Financial-promotion rules.** Listing templates enforce required disclaimers per jurisdiction; project "stories" and reels pass the same linting as listings (a construction video is still a financial promotion when attached to a live raise); UK FinProm regime, EU prospectus thresholds, US Reg D/S boundaries encoded as visibility rules, reviewed by local counsel per corridor before activation.

**Audit posture.** Hash-chained audit log (03 §3) + WORM export satisfies regulator requests; per-corridor compliance runbooks; quarterly external review of geo-gating correctness — misgating is treated as a Sev-1.

## 8. Success Metrics & KPIs

**North star: Capital Connected** — capital committed in platform-confirmed closes attributable to platform introductions. Everything else is an input.

| Stage | Metric | Y1 target | Y3 target |
|---|---|---|---|
| Supply | Live listings ≥70 readiness | 200 | 5,000 |
| Supply | Publish→first investor response | ≤14 days | ≤3 days |
| Demand | Verified investors, monthly active % | 500 / 60% | 15k / 45% |
| Matching | Interested-rate on feed top-10 | ≥8% | ≥12% |
| Matching | Accepted-intro rate | ≥35% | ≥50% |
| Deal | Intro→data-room conversion | ≥40% | ≥55% |
| Deal | Deals reaching diligence /qtr | 10 | 400 |
| Close | Capital Connected (cumulative) | $150M | $3.5B |
| Trust | Confirmed fraud reaching investors | <0.1% | <0.02% |
| Trust | Median verification turnaround | 24h | 4h |
| Retention | Investor D30 / seeker 90-day | 40% / 55% | 55% / 70% |
| Revenue | MRR / net revenue retention | $160k / — | $2.8M / >115% |
| AI | AI-artifact acceptance rate (drafts kept ≥80% intact) | 50% | 75% |
| Health | Time-to-first-value (signup→first accepted intro or ≥70 readiness) | ≤10 days | ≤3 days |

Guardrail metrics (watched, never targeted): feed session length (engagement inflation = drift toward ad-network dynamics), intro volume per user (spam creep), sponsored share of top-10 (integrity cap).

## 9. Competitive Differentiation (sharpened)

Not "combination of X and Y" — three structural bets none of the named incumbents can copy cheaply:
1. **Lifecycle ownership.** Crunchbase/PitchBook stop at data; DataSite stops at documents; AngelList stops at startup equity rails. Nexus owns discovery→close→monitoring→exit in one state machine, so every completed stage compounds the data advantage of the next.
2. **Trust as infrastructure in markets where it's scarcest.** Verification + Proof-of-Progress + confirmed track records target the corridors (Africa, frontier infra, cross-border PPP) where incumbent coverage is zero and the trust premium is highest. Winning the hard markets first builds machinery the easy markets can't refuse.
3. **Revealed-preference intelligence.** Every incumbent knows what companies *say*; Nexus knows what capital *does* — swipe-level revealed preference across an entire asset class. That corpus (Investment DNA, §1.1) is the decade-scale moat; it cannot be scraped, licensed, or bootstrapped by a fast-follower.

## 10. Invented Features (do-not-exist-today layer)

**10.1 Syndicate Autopilot.** For deals above a single investor's ticket, AI assembles the syndicate: identifies complementary investors (lead-capable + followers, DNA-fit, co-investment history), proposes allocation splits and a lead structure, opens a shared deal room on acceptance. Solves the real killer of large frontier deals — no single underwriter — by making syndication a one-click primitive instead of six months of calls. Mombasa-scale ($240M) deals become addressable by mid-size funds.

**10.2 Proof-of-Progress Oracle.** Physical-asset listings (energy, infra, real estate, agri, mining) link to independent progress verification: commercial satellite imagery diffs, drone-survey uploads with cryptographic timestamps, IoT feeds (generation meters, throughput counters), auditor site attestations. Verified progress events feed Trust Score and unlock milestone-gated disbursements. Converts "trust me, construction started" — the classic frontier-market fraud vector — into checkable evidence. No competitor has this; DFIs will pay for it directly.

**10.3 Shadow IC.** Before a seeker publishes (or an investor takes a deal to committee), an AI investment committee — distinct critic personas: the skeptical CFO, the political-risk hawk, the ESG gate, the exit-focused partner — stress-tests the case and produces the dissent memo in advance. Founders fix weaknesses before real ICs find them; investors walk into committee with the counterarguments already mapped. Trains on the platform's own pass/proceed outcomes.

**10.4 Capital Weather.** Live map of capital movement: which sectors/corridors are heating (interest velocity, term compression, oversubscription) or cooling, rendered like a weather system over the map explore surface. Sponsors time their raises; investors spot crowding before entry; governments see exactly which policy events moved investor attention. Aggregate-only (k-anonymity threshold per cell) — insight without surveillance.

**10.5 Warm-Path Router.** Relationship graph computes the *strongest* path to any target — weighted by confirmed deal history and responsiveness, not mere connection existence — and drafts the forwardable intro request for each hop. LinkedIn shows that a path exists; Nexus knows which paths actually transmit trust, because it observes which intros convert.

**10.6 Deal Time-Machine.** Every listing claim is versioned immutably; any investor can diff the current data room against any past date ("projections revised down 30% two weeks after the anchor committed — why?"). Silent revisionism, endemic in private markets, becomes structurally impossible. Cheap to build on the existing audit chain; devastating as a trust differentiator.

## 11. Assumptions Challenged (this spec's own red-team)

- *"AI everywhere" risk:* AI features fail institutionally when wrong confidently. Mitigation baked in: every AI output is cited, labeled, appealable, and human-overridable; acceptance-rate KPI (§8) measures whether AI is actually trusted, not just shipped.
- *Feature breadth vs. focus:* this spec lists ~20 first-class products; building them simultaneously would kill the company. The roadmap (07) sequences ruthlessly — MVP is discovery+match+rooms only; everything else gates on corridor liquidity proof.
- *Gamification in a trust business:* engagement mechanics stop at the trust boundary (02 §7) — no streak ever touches a score, no leaderboard ever ranks by capital deployed publicly without opt-in.
- *"Nothing happens off-platform" is aspiration, not enforcement:* mature players will always take relationships offline; the design response is §5's value-based retention, and the metric that matters is what share of *state* (documents, terms, track record) lives on-platform, not what share of conversations.
