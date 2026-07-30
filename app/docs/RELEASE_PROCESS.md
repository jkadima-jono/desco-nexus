# Release process

## Principle

Application builds must not change production schema or business data. `vercel-build` generates the Prisma client, checks configuration and builds Next.js. Database migration and catalogue synchronization are separate, operator-approved steps.

## Baseline the existing database once

The live database predates Prisma migration history. Do not run a generated initial migration against it blindly.

### Isolated restore declaration

Before any database command, record:

- restore name and immutable backup identifier;
- database owner and release operator;
- source recovery timestamp;
- confirmation that the restore accepts no production traffic;
- confirmation that credentials are scoped to the isolated restore;
- planned deletion date for the restore.

Use a name containing `restore`, `test`, `sandbox` or `preview`. Never store the
connection URL in the repository or pass it on a command line where it may appear
in process listings. Load it into the release shell:

```bash
export TEST_DATABASE_URL='<isolated restore URL>'
export DATABASE_URL="$TEST_DATABASE_URL"
export TEST_DATABASE_ISOLATED=true
```

The repository guards reject recognisable production names, but naming checks are
only a secondary control. The operator remains responsible for verifying the
project and branch in the database provider console.

### Compare and preflight without mutation

Generate the SQL needed to move the restored schema to the candidate datamodel.
This reads the restore and writes SQL to `/tmp`; it does not apply the SQL:

```bash
npx prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script \
  --output /tmp/restored-to-candidate.sql

npm run db:preflight
```

Review `/tmp/restored-to-candidate.sql` line by line. The preflight must show no
duplicate `ListingImage` positions before the composite unique constraint is
created. Record every legacy document scan-state/lifecycle count and agree the
operator decision for each affected document. Do not interpret `pending` as clean.

### Create and prove the baseline

Work in a clean release branch. Choose a UTC identifier, for example
`20260730_existing_database_baseline`; do not reuse this example without recording
the actual identifier.

1. Generate the baseline SQL from the isolated restore's actual schema:

   ```bash
   export BASELINE_ID='<UTC identifier>_existing_database_baseline'
   export CANDIDATE_MIGRATION_ID='<later UTC identifier>_operational_controls'
   mkdir -p "prisma/migrations/$BASELINE_ID"
   npx prisma migrate diff \
     --from-empty \
     --to-schema-datasource prisma/schema.prisma \
     --script \
     --output "prisma/migrations/$BASELINE_ID/migration.sql"
   printf 'provider = "postgresql"\n' > prisma/migrations/migration_lock.toml
   ```

2. Review the baseline against the restored schema. It must describe what already
   exists, not silently add candidate changes.
3. Save the reviewed `/tmp/restored-to-candidate.sql` as a separate, later migration:

   ```bash
   mkdir -p "prisma/migrations/$CANDIDATE_MIGRATION_ID"
   cp /tmp/restored-to-candidate.sql \
     "prisma/migrations/$CANDIDATE_MIGRATION_ID/migration.sql"
   ```

   Review destructive statements, table locks, defaults, nullability, indexes and
   data backfills. Use expand/backfill/contract sequencing. Never combine the
   existing-schema baseline and candidate delta into one migration.
4. On the isolated restore only, mark the baseline as applied and deploy the later
   candidate migration:

   ```bash
   npx prisma migrate resolve --applied "$BASELINE_ID"
   npm run db:status
   npm run db:deploy
   npm run db:status
   npm run db:preflight
   ```

5. Run the application and API tests against that same disposable restore. API
   tests require all of these controls:

   ```bash
   export API_TEST_ALLOW_ISOLATED_DB=I_UNDERSTAND_THIS_MUTATES_DATA
   export BASE_URL=http://localhost:3000
   npm run test:api
   ```

6. Delete and restore the isolated database again, then repeat the baseline and
   deploy sequence from a clean state. This proves repeatability.
7. Only after the comparison proves equivalence may an approved operator mark the
   baseline as applied on the existing database. Back up production immediately
   before this step and record the exact commands and timestamps.

The exact baseline command and migration identifier must be recorded in the release ticket. This repository deliberately does not invent an applied migration identifier for the live database.

## Every release

1. Record candidate commit SHA and release owner.
2. Run `npm ci`, Prisma generation, typecheck, unit tests, API tests and production build.
3. Run `npm run db:status`.
4. Back up before any structural database change.
5. Review migration SQL using expand/backfill/contract sequencing.
6. Run `npm run db:deploy` once from the controlled release job.
7. Deploy the exact tested commit.
8. Run `npm run smoke:production`.
9. Run `npm run release:catalog` only when a reviewed catalogue version is part of the release.
10. Record migration, catalogue version, deployment URL and smoke result.

## Release-ticket evidence template

```text
Release title:
Release owner:
Incident/release approver:
Candidate commit SHA:
Candidate branch:
Repository clean at test time: yes/no

Production database project and branch:
Backup identifier:
Backup timestamp:
Restore name:
Restore owner:
Restore recovery timestamp:
Restore deletion date:
Confirmed isolated/no production traffic by:

Baseline migration identifier:
Baseline SQL reviewer:
Candidate migration identifiers:
Migration SQL reviewer:
Destructive or locking statements and mitigation:
Duplicate ListingImage position result:
Legacy document scan-state counts:
Document backfill decision record:

Restore migrate status before:
Restore deploy result:
Restore migrate status after:
Restore API-test result:
Restore repeatability result:
Restore exercise elapsed time:

Typecheck result:
Unit-test result:
API-test result:
Production-build result:
Dependency-audit result:

Vercel project:
Vercel deployment identifier:
Deployment URL:
Production readiness result:
Production smoke result:
Catalogue version or not applicable:

Rollback deployment identifier:
Monitoring owner:
Release decision and timestamp:
Outstanding exceptions, owner and expiry:
```

## Rollback

Application rollback means redeploying the previous saved Vercel version. Do not reverse a database migration automatically. Prefer forward-compatible expansion migrations. If data restoration is required, follow `OPERATIONS_RUNBOOK.md` and obtain the incident commander's approval.
