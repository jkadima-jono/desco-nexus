import { prisma } from "@/lib/db";
import { apiError, apiOk } from "@/lib/api-response";
import { logOperationalEvent } from "@/lib/observability";
import { clientIpHash } from "@/lib/request-security";

export const dynamic = "force-dynamic";

const REQUIRED_CONFIGURATION = ["DATABASE_URL", "SESSION_SECRET", "NEXT_PUBLIC_SITE_URL"] as const;
const REQUIRED_SCHEMA = [
  ["Document", "scanStatus"],
  ["Document", "blobUploadedAt"],
  ["ContactInquiry", "retentionEndsAt"],
  ["OutboxEvent", "status"],
  ["MaintenanceRun", "status"],
  ["MatchAction", "requestKey"],
  ["ListingImage", "position"],
  ["LoginToken", "requestedFullName"],
  ["AccountAcceptance", "requestIpHash"],
  ["AccountLifecycleRequest", "status"],
] as const;

type SchemaRow = { table_name: string; column_name: string };
const readinessBuckets = new Map<string, { count: number; resetsAt: number }>();

function readinessRateLimited(req: Request): boolean {
  const key = clientIpHash(req);
  const now = Date.now();
  const current = readinessBuckets.get(key);
  if (!current || current.resetsAt <= now) {
    readinessBuckets.set(key, { count: 1, resetsAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 60;
}

export async function GET(req: Request) {
  if (readinessRateLimited(req)) {
    return apiError(req, 429, "rate_limited", "Too many readiness requests.");
  }
  const missing = REQUIRED_CONFIGURATION.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    logOperationalEvent("error", "health.ready.configuration_missing", { count: missing.length });
    return apiError(req, 503, "not_ready", "Required runtime configuration is unavailable.");
  }
  try {
    const rows = await Promise.race([
      prisma.$queryRaw<SchemaRow[]>`
        SELECT table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND (
            (table_name = 'Document' AND column_name IN ('scanStatus', 'blobUploadedAt'))
            OR (table_name = 'ContactInquiry' AND column_name = 'retentionEndsAt')
            OR (table_name = 'OutboxEvent' AND column_name = 'status')
            OR (table_name = 'MaintenanceRun' AND column_name = 'status')
            OR (table_name = 'MatchAction' AND column_name = 'requestKey')
            OR (table_name = 'ListingImage' AND column_name = 'position')
            OR (table_name = 'LoginToken' AND column_name = 'requestedFullName')
            OR (table_name = 'AccountAcceptance' AND column_name = 'requestIpHash')
            OR (table_name = 'AccountLifecycleRequest' AND column_name = 'status')
          )
      `,
      new Promise((_, reject) => setTimeout(() => reject(new Error("database readiness timeout")), 2_000)),
    ]) as SchemaRow[];
    const present = new Set(rows.map((row) => `${row.table_name}.${row.column_name}`));
    const missingSchema = REQUIRED_SCHEMA.filter(([table, column]) => !present.has(`${table}.${column}`));
    if (missingSchema.length > 0) {
      logOperationalEvent("error", "health.ready.schema_incompatible", { count: missingSchema.length });
      return apiError(req, 503, "schema_incompatible", "The database schema is not compatible with this release.");
    }
    return apiOk(req, {
      ok: true,
      status: "ready",
      dependencies: { database: "available", schema: "compatible" },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logOperationalEvent("error", "health.ready.database_unavailable", {
      errorType: error instanceof Error ? error.name : "unknown",
    });
    return apiError(req, 503, "not_ready", "A required dependency is unavailable.");
  }
}
