# DESCO Nexus measurement plan

The pilot is measured at organization and decision-journey level. Raw traffic and account counts are secondary.

## Primary outcomes

- Approved investor organizations activated
- Sponsor submissions reaching review-ready status
- Median days from submission to review-ready
- Opportunity views leading to qualified information requests
- Data-room requests approved, denied and awaiting response
- Median data-room approval time
- Required evidence fields disclosed
- Investor rejection reasons by project and mandate
- Weekly active organizations
- Access-control and security incidents

## Event contract

`/api/events` accepts a fixed allowlist of privacy-minimised events. It does not accept names, email addresses, IP addresses, cookies or free text.

- `page_view`
- `contact_submitted`
- `opportunity_viewed`
- `evidence_opened`
- `comparison_started`
- `information_requested`
- `data_room_requested`
- `mandate_created`
- `submission_started`
- `submission_completed`

New events require a named decision they support, a documented owner and a retention decision. Do not add advertising trackers or experimentation scripts before consent, privacy and traffic-volume requirements are approved.
