# UX acceptance matrix

Use this matrix before publishing a production acquisition experience. Record evidence from the exact build proposed for release.

## Test record

- Build or commit:
- Preview URL:
- Test date:
- Tester:
- Browser and version:
- Operating system:
- Database or seed version:
- Known exclusions:
- Final result: Pass / Fail / Blocked

For every failed or blocked row, record the route, locale, role, viewport, reproduction steps, screenshot or recording link, expected result, actual result, severity and owner.

## Public route coverage

Test each route signed out in English, French, Spanish, Portuguese and Chinese.

| Route | Required checks | Result | Evidence / issue |
| --- | --- | --- | --- |
| `/` | Hero actions, featured opportunity, public shell, disclosure language |  |  |
| `/opportunities` | Filters, clear filters, empty state, 1–4 comparison selection |  |  |
| `/project/[public-id]` | Back link, evidence hierarchy, related-party disclosure, mobile actions, report-information action |  |  |
| `/investors` | Workspace-access action reaches the correct contact topic |  |  |
| `/sponsors` | Both submission actions reach the project-submission contact topic |  |  |
| `/pillars` | Partnership and opportunity actions |  |  |
| `/pillars/[slug]` | Breadcrumb, pillar content and institutional-partnership action |  |  |
| `/diligence` and `/trust` | Process, disclosure and legal-status language |  |  |
| `/pricing` | Proposed-model status and commercial inquiry action |  |  |
| `/partners` and `/about` | Partnership actions and factual claims |  |  |
| `/contact?topic=[topic]` | Correct topic, paused-form email fallback or working form, legal notice |  |  |
| `/login` | Production access copy, no demo personas, working request-access action |  |  |
| `/legal` | Current legal and privacy status |  |  |

Acceptance for every route:

- The route returns the intended page or redirect with no console error, hydration warning, untranslated key or broken approved image.
- Header, page copy, actions, disclosures, errors and metadata use the selected locale.
- The locale persists after navigation and reload.
- Primary actions complete a real journey and do not enter unavailable production authentication.
- Claims distinguish sponsor-provided information, internal review, independent verification, proposed terms and unavailable capabilities.

## Role coverage

Use deterministic seeded demo data in a non-production preview. Administrator testing is local-only.

| Role | Routes and tasks | Result | Evidence / issue |
| --- | --- | --- | --- |
| Signed out | Public route matrix; contact and access-request journeys |  |  |
| Investor | `/match`, `/mandates`, `/saved`, `/saved/compare`, `/deals`, `/messages`; project save, information and room requests |  |  |
| Project owner | `/submit-project`, owned project room and photos, `/sponsor/investors`, `/messages` |  |  |
| Advisor | `/match`, assigned deals, messages and project evidence |  |  |
| Administrator | `/admin`, verification, submissions, inquiries, contracts, analytics and users |  |  |

Role acceptance:

- Public-header workspace action opens the correct role landing page.
- Sidebar exposes only permitted routes and identifies the current page.
- Direct unauthorized navigation redirects without rendering protected data.
- Logout clears the session.
- Owner submission covers load/retry, create, edit, required-field failure, save, submit, withdraw and delete. Each result has localized visible and assistive-technology feedback.

## Language coverage

| Locale | Public matrix | Investor | Owner | Advisor | Admin local | Evidence / issue |
| --- | --- | --- | --- | --- | --- | --- |
| English |  |  |  |  |  |  |
| French |  |  |  |  |  |  |
| Spanish |  |  |  |  |  |  |
| Portuguese |  |  |  |  |  |  |
| Chinese |  |  |  |  |  |  |

Use a fluent reviewer for financial, legal and access-control language. Automated string checks do not establish translation quality.

## Responsive, zoom and text reflow

| Viewport or setting | Required checks | Result | Evidence / issue |
| --- | --- | --- | --- |
| 320 × 568 | No horizontal page scroll; drawers and fixed project actions remain usable |  |  |
| 360 × 800 | Forms, comparison selectors and project cards do not overlap |  |  |
| 390 × 844 | Primary mobile reference; bottom safe area and gallery controls |  |  |
| 768 × 1024 | Tablet navigation, forms and two-column transitions |  |  |
| 1024 × 768 | Workspace sidebar transition and landscape height |  |  |
| 1440 × 900 | Laptop layout and content hierarchy |  |  |
| 1535 × 864 | Public navigation immediately below the `2xl` breakpoint |  |  |
| 1536 × 864 | Public desktop navigation at the `2xl` breakpoint |  |  |
| 1920 × 1080 | Maximum content widths and whitespace |  |  |
| 200% browser zoom at 1280 × 800 | Complete reflow with no lost controls or clipped text |  |  |
| 320 CSS px equivalent / 400% reflow | One-dimensional reading except intentional data tables |  |  |
| 200% text size | Labels, disclosure chips, buttons and errors remain legible |  |  |

## Keyboard acceptance

Run on the homepage, opportunities, project detail, contact, login, public drawer, workspace drawer, submission form, comparison controls and image dialog.

| Check | Acceptance | Result | Evidence / issue |
| --- | --- | --- | --- |
| Skip link | First Tab reveals it; Enter moves focus to `main` |  |  |
| Focus order | Matches visual and reading order |  |  |
| Focus visibility | Every interactive control has a visible indicator |  |  |
| Navigation drawers | Focus enters, cycles, closes on Escape and returns to trigger |  |  |
| Image dialog | Keyboard opens and closes it; background is unavailable while open |  |  |
| Native controls | Selects, checkboxes, text fields and buttons work without a pointer |  |  |
| Fixed actions | No focus trap or content obstruction |  |  |
| Disabled states | Unavailable actions are understandable and not operable |  |  |

## Screen-reader acceptance

Run VoiceOver with Safari on macOS or iOS and NVDA with Chrome on Windows. Add TalkBack with Chrome on Android when available.

| Check | Acceptance | VoiceOver | NVDA | Evidence / issue |
| --- | --- | --- | --- | --- |
| Landmarks | Header, navigation, main and footer are named and ordered usefully |  |  |  |
| Headings | One clear page heading and a coherent hierarchy |  |  |  |
| Forms | Localized labels, types, required state, errors and success are announced |  |  |  |
| Dynamic status | Loading, result count and mutation confirmation announce once without moving focus |  |  |  |
| Cards and images | Names are meaningful; decorative images are ignored |  |  |  |
| Disclosure | Status and risk meaning does not depend on colour |  |  |  |
| Dialogs | Name, close action, focus containment and focus return are announced |  |  |  |
| Workspace controls | Sidebar, lifecycle stage and mobile message controls use the active locale |  |  |  |

## Required evidence and release decision

Minimum evidence:

- Screenshots at 390, 1024, 1440 and both sides of the 1536 breakpoint.
- A keyboard recording for the public opportunity journey and owner submission.
- VoiceOver and NVDA notes for homepage → opportunities → project → contact and the submission form.
- Console capture showing no runtime or hydration errors.
- Issue links for every failure or blocker.

Release passes only when all critical public routes work in five languages, investor/owner/advisor preview roles pass, local administrator coverage passes, responsive and 200% zoom checks pass, and keyboard plus VoiceOver/NVDA critical journeys have recorded evidence.
