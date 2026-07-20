# DESCO Nexus — Product Definition
*Personas · Journeys · Information Architecture · Screens · Features · Permissions · Gamification*

## 1. User Personas

### Investors
| Persona | Profile | Job to be done | Success metric |
|---|---|---|---|
| **Amara — Family Office Principal** (Dubai) | $400M AUM, 3-person team, sector-agnostic, Africa-curious | Screen 50 deals/week without analysts | Time-to-shortlist < 10 min/day |
| **Marcus — Infra Fund Director** (London) | $2B fund, mandates: energy/transport, ticket $30–150M, needs government cover | Source bankable PPP projects with sovereign backing | 2 qualified projects/quarter |
| **Li Wei — CVC Head** (Singapore) | Strategic buyer, healthcare + agtech | Find acquisition targets + strategic stakes | Pipeline of 20 vetted targets |
| **Sarah — Impact/DFI Officer** (Washington) | Blended finance, ESG mandatory, long diligence | Verifiable ESG data + local co-investors | ESG-complete data rooms |
| **Jonas — Angel/HNWI** (Berlin) | $25–250k tickets, mobile-first, follows trends | Discover early deals like scrolling social | Daily engaged use |

### Capital Seekers
| Persona | Profile | Job to be done |
|---|---|---|
| **Dieudonné — Agri-processing founder** (Lubumbashi) | $8M expansion raise, strong ops, weak materials | Look credible to global investors; get meetings |
| **Fatima — Renewable developer** (Casablanca) | 120MW solar portfolio, needs $90M project finance | Reach infra funds + DFIs, manage parallel diligence |
| **Gov. Investment Agency officer** (Kinshasa) | 30 PPP mandates (ports, roads, SEZs) | Attract & track international investors, look modern |
| **Tech founder** (Lagos) | Series A SaaS | Warm paths to sector VCs; avoid 200 cold emails |

### Advisors
| Persona | Job to be done |
|---|---|
| M&A boutique partner | Originate mandates; showcase closed deals |
| Law firm associate | Be discoverable at the moment a deal needs counsel |
| Valuation/engineering firm | Get embedded into diligence workflows |

## 2. Complete User Journeys (key flows)

### Investor journey: cold → committed
1. **Invite/apply** → KYC + accreditation upload → verification badge (24h SLA)
2. **Mandate setup** (guided or AI-parsed from a paragraph): sectors, geos, ticket, instrument, risk, ESG prefs
3. **First feed session**: 10 curated cards; every swipe teaches the match engine
4. **Interest** on a project → auto-NDA (one-tap, templated) → teaser unlock
5. **Request data room** → seeker approves → diligence checklist auto-generated
6. **Meeting scheduled** in-app (calendar sync) → AI meeting summary posted to deal thread
7. **Move deal through pipeline** (Screen → IC → Term Sheet → Closed) → on close, both sides confirm → **track-record graph updated, Capital Connected counted**

### Seeker journey: idea → funded
1. Sign up → org verification (registry lookup + docs)
2. **AI onboarding interview** (15 min voice/text) → draft profile, teaser, and readiness score generated
3. Readiness coach: "Your financials lack 3-yr projections — generate now?" → gaps closed
4. Publish listing (visibility: public teaser / verified-investors-only / invite-only)
5. Receive interest → accept/decline (double-opt-in protects both sides)
6. Data room: drag-drop docs → AI auto-indexes into diligence taxonomy
7. Weekly AI investor-update drafts keep interested investors warm
8. Close → success story reel → reputation + badges accrue

### Government journey
1. Agency onboarded (enterprise contract) → white-label country portal
2. Upload PPP pipeline via spreadsheet/API → AI normalizes into project cards
3. Dashboard: investor views, interest by country/sector, funnel analytics
4. Host virtual investor day (live event) → 1:1 scheduled meetings

## 3. Information Architecture

```
Nexus
├── Discover (home)
│   ├── For You feed (cards + reels)
│   ├── Trending / Editor's Picks / New on Nexus
│   ├── Map explore (heat map by country/sector)
│   └── Sector & Country hubs
├── Match
│   ├── Flow mode (swipe queue)
│   └── Mandate manager
├── Deals (pipeline CRM)
│   ├── Stages board · List · Forecast
│   └── Deal detail → thread, tasks, docs, IC memo
├── Rooms (data rooms)
├── Messages (DM, deal threads, group rooms, video)
├── Network (connections, orgs, communities, events)
├── Insights (analytics, market reports, watchlists)
├── AI (assistant home: generate, analyze, search)
└── Profile & Settings (identity, verification, billing, permissions)
```

## 4. Screen Inventory (MVP → full)

**MVP (buildable now, mock-data first):**
1. Discover feed 2. Project detail (scores, team, docs) 3. Match/swipe
4. Deal pipeline 5. Data room 6. Messages 7. NL search 8. Investor mandate/profile 9. Seeker listing editor 10. Verification/onboarding

**Phase 2+:** Reels player, Stories, Live events, Communities, Map explore, Portfolio dashboard, IC workspace, Admin consoles (super/country/org), Moderation queue, Revenue dashboard, Report builder, Certification center.

## 5. Feature Catalogue (by domain)

- **Discovery:** infinite feed, vertical video reels, stories, trending, editor's picks, AI recs, nearby, map + heat maps, sector/country exploration, saved searches, watchlists.
- **Matching:** swipe (interested/maybe/pass/save), follow, request info/meeting, AI Match Score, Compatibility, Investment-Readiness Score, ESG Score, Risk Score, Expected-Return band, Portfolio-Fit.
- **Social:** posts, images, video, live, highlights, comments, likes, shares, bookmarks, collections, verified/creator profiles, groups, events, pages, polls, articles, thought leadership.
- **Investment:** VDRs, diligence checklists, financial models, decks, legal docs, cap tables, IMs, risk analysis, valuation tools, portfolio tracking, fundraising progress, investor updates, milestones, pipeline CRM, IC workflows, approvals, e-sign, NDA, KYC/AML, accreditation, secure messaging, video meetings.
- **AI:** deal assistant, find investors/targets, prepare pitch, improve project, analyze/compare investments, valuation estimate, generate IM/teaser/CIM/updates/projections/DD checklist, summarize docs, auto-translate (EN/FR first), presentations, reports, board papers, founder & investor coaching, interest prediction, intro recommendations.
- **Search:** natural-language ("renewable projects in Africa $20–100M"), structured filters, semantic doc search.
- **Trust:** identity/company/government/investor verification, KYC/AML, background checks, reputation score, response rate, success rate, completed transactions, ratings, verified reviews, badges.
- **Communication:** DM, voice, video, group chat, investor/project rooms, communities, announcements, live events, webinars, calendar/scheduling, AI meeting summaries, translation.

## 6. Permission Model (RBAC × relationship)

**Account roles:** guest · member · verified-member · org-admin · org-owner
**Org types:** investor · seeker · advisor · government
**Platform roles:** super-admin · country-admin · moderator · compliance · support · finance · sales · analytics

**Object-level rules (examples):**
| Object | View | Edit | Share |
|---|---|---|---|
| Public teaser | anyone | seeker org-admin | anyone |
| Full listing | verified investors matching visibility rules | seeker | with NDA |
| Data room doc | room members per-folder grant | uploader/admin | watermark + expiring links |
| Deal pipeline | deal team members | deal owner | org-internal |
| Track record | public (aggregated), counterparty-confirmed | system only | — |
| KYC docs | compliance role only | user | never |

Every grant is auditable (immutable audit log); data-room access supports view-only, watermarking, download bans, expiry, and per-document analytics.

## 7. Gamification & Reputation

- **Levels & points:** activity (quality-weighted — a completed diligence > 100 likes).
- **Badges:** Verified, Top Responder (<24h), Deal Closer, Sector Expert, Early Believer, Ecosystem Builder.
- **Leaderboards:** Top Investors / Top Founders per sector & region (opt-in; institutional users can hide).
- **Streaks:** daily deal-review streak for Flow mode (drives investor habit).
- **Referral rewards:** AI credits + premium months for verified invites (both sides).
- **Milestones:** fundraise progress bars, "80% to first close" celebrations.
- **Guardrail:** reputation is *earned via confirmed counterparty actions*, never purchasable; gamification never touches trust/verification signals.
