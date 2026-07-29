# DESCO Compass release and pilot gates

This file defines the minimum controls for promoting a build or onboarding a pilot organization.

## Release ownership

- The Product Director owns scope and release acceptance.
- The Principal Engineer owns technical readiness and rollback.
- The investment-product owner approves project claims and evidence status.
- Legal or compliance approves regulated language, compensation and jurisdictional scope.
- Security approves production authentication, confidential access and incident controls.

One commit SHA must be recorded for staging and production. A production deployment must not be approved from an unreviewed branch or an inaccessible preview.

## Required automated checks

- `npm ci`
- `npx prisma generate`
- `npm run typecheck`
- `npm run build`
- API integration tests against an isolated PostgreSQL database
- Browser tests at 320, 390, 768, 1024 and 1440 pixels
- WCAG 2.2 AA automated checks plus keyboard review
- Dependency, secret and static-code scanning

## Pilot acceptance

- Production authentication verifies identity and email ownership.
- Administrators and confidential-room users use MFA.
- Organization invitations, role approval and access removal work.
- Every public project claim has an owner, source, review status and review date.
- Restricted files require explicit, revocable access and create audit events.
- Commercial access is controlled by an approved organization contract.
- Monitoring, backup restoration, rollback and incident procedures have named owners.
- The privacy notice describes the first-party, privacy-minimised product events collected by `/api/events`.

## Capabilities that remain gated

Capital calls, distributions, portfolio accounting, payment processing, self-service billing and transaction-based compensation must remain demo-only until their legal owner, source system, accounting controls and approval process are documented.
