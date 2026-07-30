import { prisma } from "./db";
import { logOperationalEvent } from "./observability";
import type { Prisma } from "@prisma/client";
import { del } from "@vercel/blob";

type NotificationPayload = {
  userId?: string;
  orgId?: string;
  excludeUserId?: string;
  type: string;
  title: string;
  body: string;
  link?: string;
};

async function deliver(tx: Prisma.TransactionClient, type: string, rawPayload: string) {
  const payload = JSON.parse(rawPayload) as NotificationPayload;
  if (type === "blob.delete") {
    const storageKey = (JSON.parse(rawPayload) as { storageKey?: string }).storageKey;
    if (!storageKey) throw new Error("blob.delete requires storageKey");
    await del(storageKey);
    return;
  }
  if (type === "notification.user") {
    if (!payload.userId) throw new Error("notification.user requires userId");
    await tx.notification.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        link: payload.link,
      },
    });
    return;
  }
  if (type === "notification.org") {
    if (!payload.orgId || !payload.excludeUserId) throw new Error("notification.org requires orgId and excludeUserId");
    const members = await tx.user.findMany({
      where: { orgId: payload.orgId, id: { not: payload.excludeUserId } },
      select: { id: true },
    });
    await tx.notification.createMany({
      data: members.map(({ id }) => ({
        userId: id,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        link: payload.link,
      })),
      skipDuplicates: true,
    });
    return;
  }
  throw new Error(`Unsupported outbox event type: ${type}`);
}

export async function processOutbox(limit = 50) {
  let completed = 0;
  let failed = 0;
  for (let index = 0; index < limit; index += 1) {
    const event = await prisma.$transaction(async (tx) => {
      const candidate = await tx.outboxEvent.findFirst({
        where: {
          availableAt: { lte: new Date() },
          OR: [
            { status: "pending" },
            { status: "failed", attempts: { lt: 8 } },
            { status: "processing", lockedAt: { lt: new Date(Date.now() - 10 * 60 * 1000) } },
          ],
        },
        orderBy: { createdAt: "asc" },
      });
      if (!candidate) return null;
      const claimed = await tx.outboxEvent.updateMany({
        where: { id: candidate.id, status: candidate.status, attempts: candidate.attempts },
        data: { status: "processing", lockedAt: new Date(), attempts: { increment: 1 } },
      });
      return claimed.count === 1 ? candidate : null;
    });
    if (!event) break;
    try {
      await prisma.$transaction(async (tx) => {
        await deliver(tx, event.type, event.payload);
        await tx.outboxEvent.update({
          where: { id: event.id },
          data: { status: "completed", processedAt: new Date(), lockedAt: null, lastError: "" },
        });
      });
      completed += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 500) : "unknown";
      const attempts = event.attempts + 1;
      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: {
          status: "failed",
          lockedAt: null,
          lastError: message,
          availableAt: new Date(Date.now() + Math.min(60, 2 ** attempts) * 60_000),
        },
      });
      logOperationalEvent("error", "outbox.delivery_failed", { eventId: event.id, eventType: event.type, attempts });
      failed += 1;
    }
  }
  return { completed, failed };
}
