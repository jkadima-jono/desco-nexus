# Redesign Analysis — desco.global → Nexus

## Site audit (desco.global, captured July 2026)
**Identity:** full-bleed human-in-the-field imagery hero with dark scrim; bold ALL-CAPS extrabold display type; circular gold/rainbow coin logo; generous negative space; thin outline CTAs; EN/FR toggle; a lean 4-item institutional nav (Who We Are · Integrated Pillars · Our Impact · Partner With Us).
**Voice:** short declarative statements ("We do not speculate. We structure. We secure. We execute."); risk reframed as trust ("The biggest risk in frontier mining isn't geology. It's trust."); explicit 3-step model — Secure Access → Build Foundations → Deploy Strategic Capital.
**Credibility signals:** decade-on-the-ground claim in DRC/Southern Africa, named institutional frameworks, community-consent language, transparent due-diligence claims — authority built through specificity and repetition of governance vocabulary, not logos or badges.
**Structure:** hero → who we are → approach (numbered) → trust-attribute list → pillar cards (Mining, InvestDesco, AgriDesco, PharDesco, WaterDesco…) each with a one-line LEARN MORE → closing partner CTA.

## Gap analysis
| Dimension | Nexus today | Gap vs. this language |
|---|---|---|
| Brand voice | Functional, product-first | No institutional declarative narrative layer |
| Storytelling | None outside the app shell | Missing who/why-Africa/why-DRC/vision arc |
| Pillar identity | Sector color chips only | No dedicated pillar showcase pages |
| Motion | Card entrance, swipe physics | No scroll-reveal, no animated counters |
| Imagery | Branded SVG patterns + uploads | No full-bleed narrative hero photography slot |
| Trust surfaces | Evidence drawers (claim/source/limitation) | Already ahead of the reference site — keep |

## Strategy
Add a marketing/storytelling layer (`/pillars`) in the reference site's *voice and structure*, written fresh — no copied sentences, no copied imagery, no copied layout grid measurements. Keep the product app (Discover/Match/Deals/etc.) as the working system; the pillar layer explains the "why" and funnels into it. Reusable components: `PillarHero`, `StatCounter`, `ApproachSteps`, `Timeline`, `PillarCard`.

## Priority order
1. `/pillars` index (narrative spine: who/why Africa/why DRC/vision/pillars grid/CTA)
2. `/pillars/[slug]` — 9 pillar pages (mining, investdesco, agridesco, phardesco, waterdesco, infrastructure, ports-logistics, community-development, esg-sustainability)
3. Reusable animated-counter + scroll-reveal primitives
4. Sidebar nav entry linking product ⇄ story layer

## Explicitly deferred (documented, not faked)
Interactive maps (needs a maps API key/decision), downloadable PDF resources (needs real documents to attach — placeholders would violate "no fake trust claims"), per-pillar photo galleries (needs licensed imagery), dark-theme toggle (design-system-wide change, separate task), French pillar copy (translation pass after copy is approved).
