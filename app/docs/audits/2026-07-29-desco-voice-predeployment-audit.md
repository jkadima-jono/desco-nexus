# DESCO Compass voice and pre-deployment audit

Date: 29 July 2026
Scope: public pages, opportunity catalogue, navigation, responsive structure, localisation, search, disclosure, authentication boundaries, catalogue synchronisation and deployment readiness.

## Release position

The application builds successfully and the unit suite passes. The release is not ready to be represented as publicly deployed because the intended production domain is not currently reachable:

- `desco.global` resolves to the separate DESCO corporate WordPress website.
- `compass.desco.global` does not resolve in DNS.
- The inspected Vercel deployment URL redirects unauthenticated visitors to Vercel sign-in.

The deployment must use a public Compass application domain. The existing pre-deployment check correctly rejects `desco.global` as `NEXT_PUBLIC_SITE_URL`.

## Changes completed

### DESCO institutional voice

- Rewrote the English public project summaries in DESCO’s voice: “we present”, “we structure”, “we develop” and “we require”.
- Retained “sponsor-provided” and equivalent terminology only in evidence classification, access-control and provenance contexts where attribution is legally and analytically necessary.
- Updated core homepage, about, investor, project-company and partner copy to speak as DESCO.
- Updated the public metadata description to DESCO’s institutional voice.
- Made all source-catalogue opportunities deployment-managed so reviewed narrative changes reach existing database records without altering verification history or uploaded room documents.

### Projects

- Added Kasaji–Kisenge 50 MW Solar and Grid Project.
- Added LDC Integrated Housing and Urban Infrastructure Programme.
- Added EnerGulf Lotshi Onshore Exploration Block.
- Added source-specific evidence, risk and provenance records.
- Added clearly labelled illustrative visuals.
- Added French, Spanish, Portuguese and Chinese listing translations.
- Excluded unsupported headline claims from EnerGulf, including the one-page valuation and recoverable-volume figures.

### Localisation

- Fixed homepage cards that previously defaulted to English after a language change.
- Fixed search-result cards that previously defaulted to English.
- Added an automated test requiring every public listing to have a distinct summary in French, Spanish, Portuguese and Chinese.
- Added multilingual search recognition for the main sectors and DRC terminology.

### Opportunity discovery

- Corrected the capital filter so opportunities with an undisclosed requirement do not appear in a disclosed “under $10M” band.
- Applied the same rule to natural-language “under” searches.
- Added Energy as an Investdesco-aligned searchable sector.

### Navigation and responsive review

- The public header switches to a full-height mobile drawer below the desktop breakpoint, preventing desktop links from colliding.
- The authenticated workspace uses a separate fixed mobile header and full-height navigation dialog.
- Both navigation dialogs use modal focus management, Escape handling, a visible close control and return focus.
- Project-detail mobile actions are separated from the header and include safe-area padding.
- Comparison tables use deliberate horizontal scrolling; project cards and filters reflow without fixed content widths.

### Accessibility and trust review

- A keyboard skip link targets the main content region.
- Focus-visible treatment is defined globally.
- Main interactive controls generally meet the 44-pixel target size.
- Decorative brand and project images use empty alternative text where adjacent text supplies the accessible name.
- Project photographs and illustrative images are explicitly distinguished.
- Public pages keep missing evidence visible and distinguish review status from independent verification.
- Restricted documents and filenames remain behind authenticated, project-specific access checks.

## Remaining release blockers

1. Configure and verify a public application domain, preferably `compass.desco.global`.
2. Remove Vercel deployment protection from the intended public production deployment, or configure a public production target.
3. Set `NEXT_PUBLIC_SITE_URL` to the verified Compass origin.
4. Run the production smoke test against that origin.
5. Confirm the production demo-auth policy. Real email-verified authentication remains unwired by product decision.
6. Complete a live-device review at 390 px, 768 px, 1024 px and 1440 px after the public deployment is reachable.

## Validation evidence

- TypeScript check: passed.
- Unit tests: 15 passed.
- Production build: passed, including 47 generated pages.
- Catalogue localisation guard: passed for every public listing and supported locale.
- Source formatting check: passed.
- Dependency audit: not completed in this environment because the npm advisory service could not be resolved. The previous clean audit result should not be treated as refreshed by this run.

## Deployment decision

Do not push and deploy as a completed public release until the domain and Vercel protection blockers are resolved. The code changes are suitable for review and version control, but public availability must be verified after deployment.
