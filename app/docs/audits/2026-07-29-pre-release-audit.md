# DESCO Nexus pre-release audit

Date: 29 July 2026  
Scope: public website, project teasers, investor disclosure, navigation, responsive behaviour, accessibility, localization and editorial consistency.

## Release decision

The current build is suitable for a clearly labelled demonstration or pilot. It is not ready to be presented as a production institutional-investment platform.

Two gates require owner, legal or specialist input:

1. Publish counsel-approved privacy, cookie and terms notices, including the contracting entity, data controller, legal basis, retention, processors, transfers, governing law and conflicts disclosure.
2. Complete and review the French, Spanish, Portuguese and Chinese translations for page bodies, project disclosures, filters, forms, validation, metadata and accessible labels. Until then, the interface states that substantive project, financial and legal content remains in English.

## Remediation completed in this branch

- Project-specific capital is now separated from programme allocations.
- Programme allocations are excluded from the homepage project-capital total.
- Programme return targets, unit economics, operating forecasts and project return illustrations use distinct labels.
- Evidence status now distinguishes disclosed, partial and missing information.
- Port, agriculture, healthcare and pillar copy uses sponsor attribution and states material evidence gaps.
- References to potential financing institutions no longer imply participation or commitment.
- Regional images identify their source and state that the exact project location is unconfirmed.
- The desktop navigation uses a safer breakpoint for long translated labels.
- Low-contrast operational labels were increased in size and contrast.
- The login page includes a clear route back to public opportunities.
- Opportunity comparison enforces the four-project limit and announces selection state.
- The notification panel no longer claims modal-dialog behaviour that it does not implement.
- The mobile project action-bar spacer accounts for device safe-area insets.
- The contact form requires acknowledgement of the current demonstration and legal status.

## Open product and evidence work

### Investor disclosure

- Add claim-level evidence records with document title, issuer, version, date, page, language, reviewer, review date and limitation.
- Replace the listing-level `verified` boolean with scope-specific review records.
- Publish sponsor dossiers covering legal entity, jurisdiction, registration, ownership, management, project role, authority to raise capital and conflicts.
- Add sector-specific evidence and risk frameworks for ports, agriculture and healthcare.
- Add a transaction snapshot with model date, currency, sources and uses, contingency, terms, assumptions, scenarios and reconciliation to the capital requirement.
- Define investor-access eligibility, required evidence, jurisdictions and an honest response process.

### Localization

- Move complete public-page copy models into locale dictionaries.
- Translate filters, forms, validation, image provenance, project disclosure, legal notices, metadata and accessible labels.
- Add an automated key-completeness test for every supported locale.
- Require legal review before publishing translated legal disclosures.

### UX and accessibility

- Unify desktop and mobile project actions through one role-aware action model.
- Replace remaining 9–11 px disclosure text with a 12 px minimum where it carries meaning.
- Consolidate the pillar, login, public and workspace surfaces into one radius, elevation and heading system.
- Add visual regression coverage at 320, 390, 1280 and 1440 px, at 100% and 200% zoom, for every supported locale.
- Use responsive image optimization for project cards and detail-page hero images.

### Operating readiness

- Implement production authentication only after the owner confirms the email provider, sending domain and signup policy.
- Publish the operating entity, security responsibilities, incident process and production data-control design.
- Keep the site-wide demonstration label until these controls are live and tested.

## Verification

- TypeScript type check: passed.
- Unit tests: 11 passed.
- Next.js production build: passed.
- Dependency audit: zero known production vulnerabilities using the local advisory cache. The live registry check was unavailable because this workspace could not resolve the npm registry.
- Local interactive browser test: blocked because this workspace does not permit binding a local port. Production and responsive browser checks must be repeated after deployment or in an environment that permits the local server.
