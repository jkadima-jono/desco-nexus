import { del } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { apiError, apiOk } from "@/lib/api-response";
import { logOperationalEvent } from "@/lib/observability";
import { processOutbox } from "@/lib/outbox-worker";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  return Boolean(secret && req.headers.get("authorization") === `Bearer ${secret}`);
}

export async function GET(req: Request) {
  if (!authorized(req)) return apiError(req, 401, "unauthorized", "Maintenance authorization failed.");
  const startedAt = new Date();
  let run: { id: string } | null = null;
  const now = new Date();
  const sessionCutoff = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
  const bucketCutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const eventRetentionDays = Math.max(7, Number(process.env.PRODUCT_EVENT_RETENTION_DAYS) || 90);
  const eventCutoff = new Date(now.getTime() - eventRetentionDays * 24 * 60 * 60 * 1000);
  const quarantineHours = Math.max(24, Number(process.env.QUARANTINE_EXPIRY_HOURS) || 72);
  const quarantineCutoff = new Date(now.getTime() - quarantineHours * 60 * 60 * 1000);

  try {
    run = await prisma.$transaction(async (tx) => {
      const active = await tx.maintenanceRun.findFirst({
        where: {
          kind: "daily",
          status: "running",
          startedAt: { gt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        },
        select: { id: true },
      });
      if (active) return null;
      return tx.maintenanceRun.create({ data: { kind: "daily", status: "running" }, select: { id: true } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    if (!run) {
      return apiError(req, 409, "maintenance_in_progress", "A maintenance run is already in progress.");
    }

    const [tokens, sessions, buckets, events, contacts] = await prisma.$transaction([
      prisma.loginToken.deleteMany({ where: { expiresAt: { lt: now } } }),
      prisma.session.deleteMany({ where: { createdAt: { lt: sessionCutoff } } }),
      prisma.rateLimitBucket.deleteMany({ where: { resetsAt: { lt: bucketCutoff } } }),
      prisma.productEvent.deleteMany({ where: { createdAt: { lt: eventCutoff } } }),
      prisma.contactInquiry.deleteMany({ where: { retentionEndsAt: { lt: now } } }),
    ]);
    const staleUploads = await prisma.document.findMany({
      where: {
        lifecycle: { in: ["quarantined", "rejected"] },
        receivedAt: { lt: quarantineCutoff },
        scanStatus: { in: ["pending", "error"] },
      },
      select: { id: true, storageKey: true },
      take: 100,
    });
    let quarantinesArchived = 0;
    for (const document of staleUploads) {
      if (document.storageKey) {
        try {
          await del(document.storageKey);
        } catch {
          logOperationalEvent("warn", "maintenance.quarantine_delete_failed", { documentId: document.id });
          continue;
        }
      }
      await prisma.document.update({
        where: { id: document.id },
        data: {
          lifecycle: "archived",
          scanStatus: "error",
          scanNote: "Quarantine expired before a clean scan result was recorded.",
        },
      });
      quarantinesArchived += 1;
    }
    const outbox = await processOutbox(50);
    const summary = {
      expiredTokens: tokens.count,
      expiredSessions: sessions.count,
      expiredRateBuckets: buckets.count,
      expiredProductEvents: events.count,
      expiredContactInquiries: contacts.count,
      quarantinesArchived,
      outboxCompleted: outbox.completed,
      outboxFailed: outbox.failed,
      durationMs: Date.now() - startedAt.getTime(),
    };
    await prisma.maintenanceRun.update({
      where: { id: run.id },
      data: { status: "completed", completedAt: new Date(), summary: JSON.stringify(summary) },
    });
    logOperationalEvent("info", "maintenance.daily.completed", summary);
    return apiOk(req, { ok: true, summary });
  } catch (error) {
    if (run) await prisma.maintenanceRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        completedAt: new Date(),
        summary: JSON.stringify({ errorType: error instanceof Error ? error.name : "unknown" }),
      },
    }).catch(() => undefined);
    logOperationalEvent("error", "maintenance.daily.failed", {
      errorType: error instanceof Error ? error.name : "unknown",
    });
    return apiError(req, 500, "maintenance_failed", "Scheduled maintenance failed.");
  }
}
