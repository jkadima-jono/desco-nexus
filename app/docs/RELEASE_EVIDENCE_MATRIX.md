# Release evidence matrix

## Purpose

Use this checklist before making a public teaser, investor introduction, meeting workflow, contact form or restricted data room available in production.

This document records evidence status. It does not approve a listing, investor, institution, legal position, privacy notice or release.

Never infer completion from:

- a project document, business plan, pitch deck or marketing statement;
- a user role, email address, email verification or organization name;
- a self-declared mandate, investor type, job title or ticket size;
- a demo persona, demo approval, demo NDA or preview-environment result;
- an administrator's note without the required originating artifact;
- an earlier approval for a different content version, jurisdiction, terms version or project.

## Release record

- Release candidate commit: ____________________
- Environment: ____________________
- Release owner: ____________________
- Review date: ____________________
- Evidence folder or controlled repository: ____________________
- Overall status: `not_started | collecting | under_review | blocked | ready`
- Overall status selected: ____________________
- Blocking items: ____________________
- Final release decision owner: ____________________
- Decision date: ____________________

`ready` means every applicable item below has valid evidence and no unresolved blocker. Blank fields mean incomplete.

## 1. Sponsor consent

- Status options: `not_started | requested | received | under_review | valid | rejected | expired | revoked`
- Status selected: ____________________
- Listing ID: ____________________
- Content version: ____________________
- Canonical content hash: ____________________
- Sponsor legal entity: ____________________
- Authorized signatory name: ____________________
- Signatory capacity and authority evidence: ____________________
- Approval artifact reference: ____________________
- Approval artifact SHA-256: ____________________
- Approval date: ____________________
- Expiry date, if applicable: ____________________
- Revocation status and date: ____________________
- Recorded by: ____________________
- Evidence reviewer: ____________________
- Notes or blockers: ____________________

Control: `SponsorConsent` records the listing, content version and hash, signatory, capacity, evidence reference, approval date and revocation state (`prisma/schema.prisma`, `SponsorConsent`). Publication requires an active current-version record whose content hash matches the current canonical teaser (`src/app/api/admin/listings/[id]/publication/route.ts`).

Owner: sponsor authorized signatory for consent; DESCO release operator for accurate recording; release reviewer for artifact and hash verification.

Do not mark `valid` from a general mandate, project submission, commercial relationship or unsigned email. Consent must approve the exact public content.

## 2. Legal clearance

- Status options: `not_started | instructed | under_review | cleared | qualified | rejected | expired | revoked`
- Status selected: ____________________
- Listing ID: ____________________
- Content version: ____________________
- Canonical content hash: ____________________
- Reviewing counsel name and firm: ____________________
- Counsel authority or engagement reference: ____________________
- Jurisdiction or distribution perimeter reviewed: ____________________
- Scope of clearance: ____________________
- Required legends, restrictions or conditions: ____________________
- Legal opinion or clearance artifact reference: ____________________
- Artifact SHA-256: ____________________
- Clearance date: ____________________
- Expiry or mandatory review date: ____________________
- Revocation status and date: ____________________
- Recorded by: ____________________
- Notes or blockers: ____________________

Control: `LegalClearance` records jurisdiction, scope, counsel, exact content version/hash, evidence reference, clearance date and revocation state (`prisma/schema.prisma`, `LegalClearance`). Publication requires an active hash-matching record (`src/app/api/admin/listings/[id]/publication/route.ts`).

Owner: instructed legal counsel for the legal conclusion; DESCO legal or compliance owner for scope confirmation; release operator for accurate recording.

Do not treat sponsor consent, a platform disclaimer or prior clearance in another jurisdiction as legal clearance.

## 3. Related-party review

- Status options: `not_started | facts_collected | under_review | cleared | cleared_with_disclosure | escalated | rejected | expired | revoked`
- Status selected: ____________________
- Listing ID: ____________________
- Content version: ____________________
- Canonical content hash: ____________________
- Related party identified: `yes | no | undetermined`
- Relationship type and parties: ____________________
- Source of confirmed relationship facts: ____________________
- Proposed public disclosure: ____________________
- Independent reviewer name: ____________________
- Reviewer role and independence statement: ____________________
- Conflicts or recusals: ____________________
- Committee minute or review artifact reference: ____________________
- Artifact SHA-256: ____________________
- Review date: ____________________
- Expiry or mandatory review date: ____________________
- Revocation status and date: ____________________
- Recorded by: ____________________
- Notes or blockers: ____________________

Control: `RelatedPartyReview` records the relationship conclusion, disclosure, reviewer identity and independence, exact version/hash and revocation state (`prisma/schema.prisma`, `RelatedPartyReview`). The recording workflow requires sponsor, counsel and related-party reviewer identities to differ from each other and from the recording administrator (`src/app/api/admin/listings/[id]/publication/route.ts`).

Owner: designated independent conflict reviewer or committee for the conclusion; business owner for complete relationship facts; release operator for accurate recording.

Confirmed relationship facts may prefill the factual section. They do not establish reviewer independence or complete the review.

## 4. Project-specific NDA or restricted-access terms

- Status options: `not_started | terms_drafting | terms_approved | sent | executed | rejected | expired | revoked`
- Status selected: ____________________
- Listing ID: ____________________
- Investor user and legal entity: ____________________
- Terms version: ____________________
- Approved terms SHA-256: ____________________
- Governing law and jurisdiction: ____________________
- Investor signatory name: ____________________
- Signatory capacity and authority evidence: ____________________
- Sponsor or DESCO countersignatory, if required: ____________________
- Execution provider or controlled artifact reference: ____________________
- Execution evidence SHA-256: ____________________
- Executed date: ____________________
- Expiry date: ____________________
- Revocation status and date: ____________________
- Bound data-room grant ID: ____________________
- Notes or blockers: ____________________

Control: `NdaExecution` records project/user scope, terms version/hash, signatory/capacity, execution reference, dates, expiry and revocation. `DataRoomAccess.ndaExecutionId` binds a grant to the executed record (`prisma/schema.prisma`, `NdaExecution` and `DataRoomAccess`). Effective access rechecks current institutional eligibility, NDA validity and the bound active grant (`src/lib/institutional-access.ts`, `src/lib/dataroom.ts`).

Owner: counsel for approved terms; authorized investor signatory for execution; sponsor or DESCO access owner for the grant; compliance or operations for expiry and revocation.

`demo_executed` and `demo-only-no-legal-effect` are never production evidence (`src/lib/restricted-access.ts`).

## 5. Institutional investor classification

- Status options: `not_started | evidence_requested | under_review | institutional | professional | accredited | eligible_counterparty | not_eligible | expired`
- Status selected: ____________________
- Investor user and legal entity: ____________________
- Classification jurisdiction: ____________________
- Applicable policy name and version: ____________________
- Supporting evidence references: ____________________
- Evidence SHA-256 values: ____________________
- Classification conclusion: ____________________
- Limitations or permitted activities: ____________________
- Reviewer name and authority: ____________________
- Review case or provider reference: ____________________
- Review date: ____________________
- Expiry or renewal date: ____________________
- Notes or blockers: ____________________

Control: `InstitutionalAccessProfile` stores classification, jurisdiction, reviewer, case reference and expiry (`prisma/schema.prisma`, `InstitutionalAccessProfile`). Production eligibility accepts only the explicit supported classifications and requires a completed review case (`src/lib/institutional-access.ts`).

Owner: compliance reviewer applying a counsel-approved jurisdiction policy; legal owner for the classification policy; operations for evidence retention and renewal.

Do not infer classification from wealth, fund name, self-description, plan assignment or mandate settings.

## 6. KYB, KYC, authority and integrity screening

- Status options: `not_started | documents_requested | in_review | verified | clear | review_required | rejected | expired`
- Overall status selected: ____________________
- Investor legal entity: ____________________
- Registration number and jurisdiction: ____________________
- Registry evidence reference and SHA-256: ____________________
- Beneficial owners and controllers evidence reference: ____________________
- Authorized representative evidence reference: ____________________
- Representative KYC case reference: ____________________
- Entity KYB case reference: ____________________
- Sanctions screening case reference: ____________________
- PEP and adverse-media case reference: ____________________
- Match disposition and approver: ____________________
- Risk rating: `low | medium | high | prohibited | unrated`
- Provider or controlled manual-case reference: ____________________
- Reviewer name and authority: ____________________
- Review date: ____________________
- Re-screen or expiry date: ____________________
- Revocation, suspension or escalation: ____________________
- Notes or blockers: ____________________

Control: `InstitutionalAccessProfile` separately stores representative authority, KYB, KYC, screening, risk, provider/case reference, reviewer and expiry. Production requires exact verified/clear states, an accepted risk rating and complete review metadata (`prisma/schema.prisma`, `InstitutionalAccessProfile`; `src/lib/institutional-access.ts`).

Owner: AML/KYC compliance owner; selected verification and screening provider or approved manual-case operator; designated reviewer for match disposition.

Email ownership is not KYC, KYB, authority verification or screening. Demo verification states are not accepted in production.

## 7. Restricted-action acknowledgment

- Status options: `not_present | current | stale | withdrawn | superseded`
- Status selected: ____________________
- User ID: ____________________
- Listing ID: ____________________
- Action: `information_request | data_room_request | meeting_request`
- Notice version: ____________________
- Approved notice artifact reference: ____________________
- Approved notice SHA-256: ____________________
- Classification snapshot: ____________________
- Jurisdiction snapshot: ____________________
- Acknowledged date and time: ____________________
- Superseded or withdrawal date: ____________________
- Notes or blockers: ____________________

Control: `AccessAcknowledgement` stores user, listing, action, notice version, classification/jurisdiction snapshot and timestamp (`prisma/schema.prisma`, `AccessAcknowledgement`). Information, data-room and meeting routes require the current version and eligible institutional profile (`src/app/api/match/route.ts`; `src/app/api/meetings/route.ts`).

Owner: counsel for notice wording; product or compliance owner for version control; the user for the recorded acknowledgment.

An acknowledgment proves only that the displayed notice was accepted. It is not legal clearance, NDA execution, KYC/KYB, investor classification, suitability, an offer or an investment commitment.

## 8. Privacy and contact collection

- Status options: `not_started | drafting | under_review | approved | enabled | suspended | expired | withdrawn`
- Status selected: ____________________
- Privacy notice version: ____________________
- Approved notice reference and SHA-256: ____________________
- Terms version, if applicable: ____________________
- Lawful basis by contact purpose: ____________________
- Data controller identity and contact: ____________________
- Processor and subprocessor register reference: ____________________
- International transfer mechanism: ____________________
- Retention and deletion schedule: ____________________
- Data-subject request procedure: ____________________
- Security and incident-contact procedure: ____________________
- Cookie or tracking position: ____________________
- Counsel or DPO approver: ____________________
- Approval date: ____________________
- Review or expiry date: ____________________
- Production collection flag approved by: ____________________
- Notes or blockers: ____________________

Control: the current contact notice explicitly states that it is not approved terms or a complete privacy notice (`src/lib/legal-consent.ts`). Production collection remains paused unless deliberately enabled (`src/app/api/contact/route.ts`).

Owner: controller business owner, privacy counsel or DPO, security owner and release operator.

Do not mark `approved` from the demo contact acknowledgment. Do not enable production collection until every applicable privacy field and approval is complete.

## Final operator checks

- [ ] Every applicable status is populated from its originating evidence.
- [ ] No completion state was inferred from a demo record, role, email, project file or marketing statement.
- [ ] Artifact references resolve and every recorded hash matches the retained artifact.
- [ ] Listing approvals match the current canonical content version and hash.
- [ ] Named sponsor, counsel and related-party reviewers are distinct and authorized.
- [ ] Institutional classification, KYB/KYC, authority, screening and risk reviews are current.
- [ ] Every restricted grant is bound to a valid project-specific NDA record.
- [ ] Every restricted action uses the currently approved notice version.
- [ ] Expired, revoked, superseded or rejected evidence is not treated as valid.
- [ ] Privacy/contact collection remains disabled unless its separate approval is complete.
- [ ] Database migration and API integration tests passed in a controlled environment.
- [ ] Final decision and unresolved exceptions are recorded in the release ticket.
