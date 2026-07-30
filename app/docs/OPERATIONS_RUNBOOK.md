# Operations runbook

## Service objectives

- Pilot RPO: 24 hours or better.
- Pilot RTO: 4 hours.
- Production readiness requires a successful restore exercise, not only a configured backup.

## Backup and restore

1. Confirm the managed Postgres backup and point-in-time recovery window.
2. Record a daily backup identifier and alert on missed backups.
3. Quarterly, restore into an isolated project with no production credentials.
4. Run schema status, row-count checks, access-control API tests and a sample restricted-document metadata lookup.
5. Record elapsed restore time, recovered timestamp and discrepancies.
6. Never test restoration over the live database.

Blob metadata is stored in Postgres, while file bytes are in Blob storage. A database restore does not restore deleted Blob objects. Retention and backup requirements for Blob must be agreed before confidential pilot use.

## Health and monitoring

- `/api/health/live` confirms that the application process responds.
- `/api/health/ready` confirms required configuration and database access.
- Alert on repeated readiness failures, 5xx rate, latency, database connection exhaustion, failed maintenance and quarantined uploads older than the approved threshold.
- Logs are structured JSON. Do not log names, email, contact messages, document names, tokens or file contents.

## Daily maintenance

Vercel Cron calls `/api/internal/maintenance` with `CRON_SECRET`. The job removes expired login tokens, sessions, rate-limit buckets and product events, and archives stale quarantined uploads. Inspect `MaintenanceRun` for failures and counts. The job is idempotent and may be retried.

## Incident severity

- P1: suspected confidential-data exposure, administrator compromise or destructive data loss. Page immediately.
- P2: authenticated service unavailable or restricted-document controls failing closed for all users. Acknowledge within 30 minutes during pilot cover.
- P3: one workflow degraded with a safe workaround. Handle during business support hours.
- P4: question, cosmetic defect or enhancement.

## Incident procedure

1. Name an incident commander and start an incident record.
2. Record start time, affected organizations, data classification and current release SHA.
3. Contain first: disable the affected feature, revoke sessions or remove access.
4. Preserve logs and database evidence. Do not paste confidential content into chat.
5. Communicate confirmed facts, impact and next update time.
6. Recover using a saved deployment, forward database fix or isolated restore.
7. Validate access controls and core smoke checks.
8. Close only after customer and internal communications are complete.
9. Complete a blameless review within five business days for P1/P2.

## Vendor failure

For Vercel, Neon or Blob failure, confirm vendor status, stop retries that increase load, preserve fail-closed access behavior and publish the next update time. No repository code claims multi-region failover.

## Credential rotation

Rotate one credential at a time. Session-secret rotation signs out all users. Revoke the old value after the new deployment is healthy. Record owner, time and affected service without storing the secret.
# Confidential document operations

Confidential uploads remain disabled unless both `CONFIDENTIAL_UPLOADS_ENABLED=true`
and `DOCUMENT_SCANNER_PROVIDER` are configured. These settings do not provide a
scanner; enable them only after an approved integration and operating procedure exist.
Legacy documents must be reviewed individually with `npm run documents:scan-backfill
-- --document-ids=... --status=pending|not_required --note="..."`. The command previews
by default and never marks a document clean.
