# DESCO Nexus — Design System
*Per Desco Global Visual Identity v1.0 · Investdesco pillar dominant (Gold `#B8953D`)*

## 1. Design Principles
1. **Premium calm.** White space is the luxury. Neutrals ≥ 60% of surface.
2. **Data has hierarchy.** One hero number per card; everything else recedes.
3. **Trust is visible.** Verification, scores, and provenance are first-class UI.
4. **Fast feels magical.** Optimistic UI, skeletons < 100ms, transitions ≤ 200ms.
5. **Two modes, one brain.** Flow mode (mobile, swipe, reels) and Desk mode (dense, keyboard-first) share components and data.

## 2. Design Tokens

```css
:root {
  /* Brand (Desco Global) */
  --desco-red: #C41E3A;        /* corporate core */
  --desco-gold: #B8953D;       /* Investdesco — PRIMARY accent for Nexus */
  --desco-blue: #0066CC;       /* Phardesco */
  --desco-emerald: #00A550;    /* Agridesco */
  --desco-deepblue: #0047AB;   /* Waterdesco */
  --desco-orange: #FF8C00;     /* community accent */

  /* Neutrals */
  --charcoal: #2C3E50;
  --warm-gray: #7F8C8D;
  --surface: #FFFFFF;
  --surface-alt: #F7F8FA;

  /* Semantic */
  --success: #00A550; --warning: #FF8C00; --danger: #C41E3A; --info: #0066CC;

  /* Type */
  --font-display: 'Montserrat', sans-serif;
  --font-body: 'Open Sans', sans-serif;

  /* Spacing (4px grid) */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 24px;
  --s-6: 32px; --s-7: 48px; --s-8: 64px;

  /* Radius & elevation */
  --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-full: 999px;
  --shadow-1: 0 1px 3px rgb(44 62 80 / .08);
  --shadow-2: 0 4px 16px rgb(44 62 80 / .10);
  --shadow-3: 0 12px 32px rgb(44 62 80 / .14);

  /* Motion */
  --ease-out: cubic-bezier(.16,1,.3,1);
  --t-fast: 120ms; --t-base: 200ms; --t-slow: 320ms;
}

/* Dark mode */
[data-theme="dark"] {
  --surface: #10161D;          /* charcoal-derived, not pure black */
  --surface-alt: #18202A;
  --charcoal: #E8ECF1;         /* text flips */
  --warm-gray: #8B98A5;
  --shadow-1: 0 1px 3px rgb(0 0 0 / .4);
}
```

## 3. Typography Scale (Montserrat display / Open Sans body)

| Token | Size/LH | Weight | Use |
|---|---|---|---|
| display-xl | 48/1.1 | 800 | Hero, big stats |
| display-lg | 36/1.15 | 700 | Page titles |
| heading | 28/1.2 | 600 | Section heads |
| title | 22/1.25 | 600 | Card titles |
| label | 13/1.2 | 700 caps +0.05em | Chips, table heads |
| body-lg | 18/1.55 | 400 | Lede text |
| body | 16/1.55 | 400 | Default |
| caption | 14/1.4 | 400 | Meta, captions |
| micro | 12/1.35 | 400 | Legal, timestamps |

Max 3 weights per screen. Body stays charcoal; gold/red reserved for emphasis + key stats. Never all-caps paragraphs. +15% width tolerance for FR strings.

## 4. Core Components (library inventory)

**Primitives:** Button (primary gold / secondary outline / ghost / destructive red), Input, Select, Combobox, Chip/Tag, Badge, Avatar (+org logo variant), Tooltip, Modal/Sheet, Toast, Tabs, Skeleton, ProgressBar, EmptyState.

**Domain components:**
- `ProjectCard` — hero image, sector chip, country flag, raise amount (display stat), MatchScore ring, readiness/ESG/risk mini-bars, verified badge.
- `MatchScoreRing` — 0–100 radial, gold fill, tap = "why this match" explainer sheet.
- `ScoreBars` — readiness / ESG / risk with semantic colors.
- `SwipeDeck` — gesture cards: right=interested, left=pass, up=save, tap=detail.
- `DealStageBoard` — kanban with stage-tinted headers, drag with spring physics.
- `RoomDocRow` — file icon, watermark state, view analytics sparkline.
- `ThreadBubble` — message with NDA/system event variants.
- `VerifiedBadge` — tiered (ID / Accredited / Institutional / Government) — gold check on charcoal.
- `StatCallout` — 60–72px number + micro label (brand pattern).
- `ReelPlayer` — vertical video, overlay CTA rail (interest/save/share).
- `MandateChipRow`, `CountryHeatMap`, `FundraiseProgress`, `ReputationMeter`.

## 5. Layout System
- 12-col grid desktop (1280 max content), 4-col tablet, single-col mobile.
- Desk mode: left nav rail 240px (charcoal, gold active states) + content + right context panel 320px.
- Flow mode: bottom tab bar (Discover · Match · Deals · Messages · Profile), full-bleed cards.
- Sandwich structure for marketing/onboarding: dark hero (charcoal) → white content → dark closing CTA.
- Every screen: at least one visual element (icon circle, chart, image); icon style = outline, consistent weight, in colored circles for list items.
- Avoid: accent underlines below titles, full-width colored header bars, cream backgrounds, identical repeated layouts.

## 6. Motion & Micro-interactions
- Card entrance: 12px rise + fade, 200ms ease-out, 30ms stagger.
- Swipe: card follows finger 1:1, rotation ±8°, action glyph fades in past 40% threshold; haptic on commit.
- Match ring: animates 0→score on first view (600ms, once).
- Stage change: card lifts (shadow-3), slides, settles with 1.02→1.0 scale spring.
- Numbers: count-up on stat callouts (400ms, respects `prefers-reduced-motion`).
- Never animate: trust badges, scores after first render (no "wiggling" credibility).

## 7. Accessibility
- WCAG 2.2 AA: contrast ≥ 4.5:1 body (gold on white fails for text — gold only ≥ 24px bold or on charcoal), focus rings 2px gold offset 2px, all gestures have button equivalents, full keyboard nav in Desk mode, screen-reader announcements for swipe results, captions on all reels, `prefers-reduced-motion` honored everywhere.

## 8. Voice & Content
Confident, purpose-driven, respectful, forward-looking. Numbers over adjectives ("$42M connected in Q3", not "huge traction"). EN + FR parity. Errors: what happened + how to fix, never blame. Empty states always contain one next action.
