# DESCO Nexus — Technical Architecture
*Backend · Frontend · Mobile · AI · Security · Cloud · API · Data Model*

## 1. Stack Recommendation (with justification)

| Layer | Choice | Why (vs. alternatives) |
|---|---|---|
| Web frontend | **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4** | SSR/ISR for SEO'd public teasers, RSC for fast feeds; largest hiring pool. Vs. Remix/SvelteKit: ecosystem + Vercel/self-host flexibility |
| Mobile | **React Native (Expo) + shared TS domain packages** | One product team, shared types/logic with web; native modules for video/camera. Vs. Flutter: JS talent reuse, shared validation/schema code |
| Backend | **NestJS (Node/TS) modular monolith → services** | Same language across stack; DI + module boundaries let us split later (messaging, media, AI) without a premature microservice tax |
| DB | **PostgreSQL 16 (partitioned) + read replicas** | Relational integrity for deals/permissions/money. JSONB for flexible listing schemas |
| Search | **OpenSearch + pgvector** | Keyword/faceted (OpenSearch) + semantic/NL (pgvector embeddings); merge results in ranking service |
| Cache/queues | **Redis (cache, presence) + Kafka (events)** | Feed fan-out, notifications, analytics events, audit stream |
| Object storage | **S3 + CloudFront CDN** | Docs, video masters; signed URLs, watermark pipeline |
| Video | **Mux (encode/stream) → in-house later** | Reels + live without building a video org on day 1 |
| Realtime | **WebSocket gateway (Socket.io) + LiveKit (WebRTC)** | Chat/presence vs. video meetings — different infra, both managed initially |
| Auth | **Auth.js + WebAuthn/passkeys; SAML/OIDC (WorkOS) for enterprise** | Passwordless-first consumer feel + enterprise SSO |
| Payments | **Stripe (global) + Paystack/Flutterwave (Africa)** | Corridor coverage; subscriptions + usage (AI credits) |
| AI | **Claude API (claude-fable-5 / claude-sonnet-5) + pgvector RAG** | Doc generation, summarization, matching explanations, agentic deal assistant |
| Infra | **AWS (eu-west + af-south), Terraform, EKS** | af-south-1 (Cape Town) latency + data-residency options |
| CI/CD | **GitHub Actions → ArgoCD** | Trunk-based, preview envs per PR |
| Observability | **OpenTelemetry + Grafana stack + Sentry** | Traces across monolith→services migration |
| Analytics | **Kafka → ClickHouse + dbt; PostHog product analytics** | Funnels/cohorts/heatmaps + internal metrics warehouse |

**Challenged assumption:** microservices from day 1 — rejected. A modular monolith with enforced module boundaries (Nest modules + separate schemas) ships 3x faster with 8 engineers; Kafka events from day 1 keep the door open.

## 2. Backend Architecture

```
┌────────────┐   ┌─────────────────────────────────────────┐
│  Clients   │──▶│ API Gateway (GraphQL + REST) · WAF · RL │
└────────────┘   └───────────────┬─────────────────────────┘
        ┌────────────────────────┼───────────────────────┐
        ▼                        ▼                       ▼
┌───────────────┐      ┌──────────────────┐    ┌────────────────┐
│ Core Monolith │      │ Realtime Gateway │    │ Media Service  │
│ (NestJS)      │      │ (WS, presence)   │    │ (upload, Mux)  │
│ identity/orgs │      └──────────────────┘    └────────────────┘
│ listings/deals│               │
│ rooms/perms   │        ┌──────▼──────┐   ┌──────────────────┐
│ social/notifs │───────▶│    Kafka    │──▶│ Consumers:       │
└──────┬────────┘        └─────────────┘   │ feed-ranker      │
       │                                   │ notifier         │
┌──────▼────────┐  ┌───────────────┐       │ analytics→CH     │
│ PostgreSQL    │  │ AI Orchestrator│      │ audit-writer     │
│ + pgvector    │  │ (Claude, RAG,  │      │ search-indexer   │
│ + replicas    │  │ credit meter)  │      └──────────────────┘
└───────────────┘  └───────────────┘
```

**Module boundaries (future service seams):** identity · organizations · listings · matching · deals · rooms(VDR) · social · messaging · notifications · ai · billing · trust(KYC/verification) · admin.

## 3. Database Schema (core, abridged DDL)

```sql
-- Identity & orgs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  handle CITEXT UNIQUE,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en',
  verification_tier SMALLINT DEFAULT 0,      -- 0 none,1 id,2 accredited,3 institutional
  reputation_score NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('investor','seeker','advisor','government')),
  name TEXT NOT NULL,
  country CHAR(2) NOT NULL,
  sectors TEXT[] NOT NULL DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  profile JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE org_members (
  org_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('owner','admin','member','viewer')),
  PRIMARY KEY (org_id, user_id)
);

-- Investment mandates (investor side)
CREATE TABLE mandates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  sectors TEXT[] NOT NULL,
  geographies TEXT[] NOT NULL,               -- ISO codes + regions
  ticket_min_usd BIGINT, ticket_max_usd BIGINT,
  instruments TEXT[],                        -- equity, debt, mezz, ppp...
  esg_required BOOLEAN DEFAULT false,
  risk_appetite SMALLINT,                    -- 1..5
  embedding VECTOR(1024),                    -- semantic mandate vector
  active BOOLEAN DEFAULT true
);

-- Listings (projects / raises)
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  status TEXT NOT NULL DEFAULT 'draft',      -- draft|live|paused|closed
  title TEXT NOT NULL,
  sector TEXT NOT NULL,
  country CHAR(2) NOT NULL,
  raise_usd BIGINT NOT NULL,
  instrument TEXT NOT NULL,
  stage TEXT,                                -- greenfield|expansion|series-a|...
  summary TEXT,
  detail JSONB NOT NULL DEFAULT '{}',        -- flexible per-sector schema
  scores JSONB NOT NULL DEFAULT '{}',        -- {readiness, esg, risk, return_band}
  visibility TEXT DEFAULT 'verified',        -- public|verified|invite
  embedding VECTOR(1024),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON listings USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON listings (sector, country, status);

-- Matching / swipes
CREATE TABLE match_actions (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES users(id),
  listing_id UUID REFERENCES listings(id),
  action TEXT NOT NULL CHECK (action IN ('interested','maybe','pass','save','follow')),
  match_score NUMERIC(4,3),                  -- score shown at decision time
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Deals (pipeline after mutual interest)
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id),
  investor_org_id UUID REFERENCES organizations(id),
  stage TEXT NOT NULL DEFAULT 'screening',
  -- screening|nda|diligence|ic|term_sheet|closing|closed_won|closed_lost
  amount_usd BIGINT,
  owner_user_id UUID REFERENCES users(id),
  stage_history JSONB DEFAULT '[]',
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (listing_id, investor_org_id)
);

-- Data rooms
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES deals(id),
  name TEXT NOT NULL
);
CREATE TABLE room_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id),
  folder TEXT NOT NULL DEFAULT '/',
  name TEXT NOT NULL, s3_key TEXT NOT NULL,
  size_bytes BIGINT, mime TEXT,
  uploaded_by UUID REFERENCES users(id),
  watermark BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE room_grants (
  room_id UUID, user_id UUID, folder TEXT DEFAULT '/',
  can_download BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  PRIMARY KEY (room_id, user_id, folder)
);
CREATE TABLE doc_events (            -- per-doc analytics + audit
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  document_id UUID, user_id UUID,
  event TEXT NOT NULL,               -- view|download|print_blocked
  at TIMESTAMPTZ DEFAULT now()
);

-- Messaging
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL,                -- dm|deal|group|community
  deal_id UUID NULL REFERENCES deals(id)
);
CREATE TABLE messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  thread_id UUID REFERENCES threads(id),
  sender_id UUID REFERENCES users(id),
  body TEXT, attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Trust
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_type TEXT NOT NULL,        -- user|org
  subject_id UUID NOT NULL,
  kind TEXT NOT NULL,                -- identity|company|accreditation|government
  status TEXT NOT NULL DEFAULT 'pending',
  provider_ref TEXT,                 -- KYC vendor case id
  reviewed_by UUID, decided_at TIMESTAMPTZ
);

CREATE TABLE audit_log (             -- append-only, hash-chained
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id UUID, action TEXT NOT NULL, object_type TEXT, object_id UUID,
  context JSONB, prev_hash BYTEA, hash BYTEA NOT NULL,
  at TIMESTAMPTZ DEFAULT now()
);
```

### ER summary
`users ⇄ org_members ⇄ organizations` · `organizations 1—n mandates | listings` · `users n—n listings (match_actions)` · `listings 1—n deals n—1 organizations(investor)` · `deals 1—1 rooms 1—n room_documents 1—n doc_events` · `threads 1—n messages` · `verifications → users|orgs` · everything → `audit_log`.

## 4. Matching & Feed Ranking (AI architecture, part 1)

**Match score = weighted blend, all components explainable:**
```
match = 0.30·semantic(mandate_emb, listing_emb)
      + 0.25·structured_fit(sector, geo, ticket, instrument)
      + 0.15·behavioral(collab_filter on match_actions)
      + 0.10·readiness_score
      + 0.10·trust(verification_tier, reputation)
      + 0.10·freshness/diversity boost
```
- Two-stage: ANN candidate retrieval (pgvector HNSW, top-500) → learned re-ranker (gradient-boosted, later a small transformer) → business rules (visibility, compliance, diversity caps).
- Every score renders a "Why this match" explanation (LLM-generated from feature attributions) — trust requirement, not nice-to-have.
- Feedback loop: swipes, dwell time, data-room requests, closed deals label the ranker weekly.

## 5. AI Platform (part 2 — generation & agents)

- **AI Orchestrator service:** single gateway to Claude API; per-org credit metering, prompt/version registry, output moderation, PII redaction pre-flight.
- **RAG:** listing docs chunked → embeddings in pgvector; deal assistant answers cite documents (page-anchored).
- **Generators:** teaser, CIM, IM, investor update, DD checklist, board paper, financial projection scaffolds (structured JSON → rendered templates → editable).
- **Agents:** deal assistant (tool-use over platform APIs: search, compare, schedule, draft), readiness coach, translation (EN⇄FR first).
- **Guardrails:** generated financials always labeled "AI draft — founder must verify"; no investment advice (recommendation language constrained by policy prompt + output filter); human-in-the-loop for anything sent externally.

## 6. API Design

- **GraphQL** for product clients (typed feed, nested deal/room queries); **REST** for public API + webhooks; **gRPC** internal later.
- Naming: `POST /v1/listings`, `POST /v1/listings/{id}:publish`, `GET /v1/feed?cursor=`, `POST /v1/deals/{id}/stage`, `POST /v1/rooms/{id}/grants`.
- Cursor pagination everywhere; idempotency keys on mutations; webhook events (`deal.stage_changed`, `room.document_viewed`) with HMAC signatures.
- Rate limits per tier; API keys scoped (read:listings, write:deals...) for Enterprise/API customers.

## 7. Authentication Flow

1. Passwordless email/passkey → short-lived JWT (15 min) + rotating refresh (httpOnly).
2. Step-up auth (WebAuthn) required for: data-room grants, e-sign, billing, exports.
3. Org context tokens: `act-as org` claim; server re-checks membership per request.
4. Enterprise: SAML/OIDC → JIT provisioning with domain claim verification.
5. MFA mandatory for admin/compliance roles. Device fingerprinting + anomaly alerts on new geo/device.

## 8. Security Architecture

- **Compliance path:** SOC 2 Type I (mo 9) → Type II (mo 18); GDPR + CCPA from day 1 (DSR endpoints, consent registry); data residency options per corridor.
- Encryption: TLS 1.3; AES-256 at rest; envelope encryption (KMS) for KYC docs; field-level encryption for government-sensitive listings.
- AuthZ: central policy engine (CASL/OPA) — object-level checks server-side only.
- VDR hardening: watermark-on-render, no-download grants, signed short-TTL URLs, per-page view analytics, print/copy deterrents.
- Fraud: velocity rules + ML anomaly scores on registration, messaging (anti-phishing), wire-fraud warnings on any payment-adjacent surface.
- AppSec: SAST/DAST in CI, dependency scanning, secrets manager (no secrets in code), quarterly pentest, bug bounty at GA.
- Audit: hash-chained audit_log, WORM S3 export for regulators.

## 9. Cloud & Scale Architecture

- **Now (≤100k users):** 1 region (eu-west-1) + CloudFront; RDS Multi-AZ; EKS 2 node groups; Redis; MSK serverless.
- **Scale (1M–10M):** af-south-1 active read region; listing/media read-replicas; feed pre-computation per active-user shard; ClickHouse cluster; message partitions by thread.
- **100M path:** cell-based architecture (user-sharded cells), CQRS for feed/social reads, edge caching for public teasers, regional data pods for residency (EU/Africa/GCC), dedicated media pipeline (own encoding), Kafka→per-cell buses.
- Cost guardrail: infra ≤ 12% of revenue at scale; per-feature cost dashboards (esp. AI tokens, video egress).

## 10. Testing, Deployment, Monitoring

- Testing: unit (Vitest/Jest) 80%+ on domain modules; contract tests on GraphQL/REST schemas; Playwright E2E on 8 critical journeys (signup→verify, feed→interest→NDA→room, deal stage flow, billing); load tests (k6) on feed + messaging; chaos drills quarterly.
- Deploy: trunk-based, PR preview envs, canary 5%→50%→100% with auto-rollback on SLO burn; migrations via expand/contract (never breaking).
- SLOs: feed p95 < 300ms; message delivery p95 < 500ms; search p95 < 700ms; 99.9% availability core APIs.
- Monitoring: RED dashboards per module, OTel traces, Sentry, PagerDuty rotations; product analytics (PostHog) with server-side event contract in one repo.
