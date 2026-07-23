import { prisma } from "./db";

export type NotificationType =
  | "dataroom_granted"
  | "meeting_requested"
  | "meeting_confirmed"
  | "meeting_declined"
  | "meeting_cancelled"
  | "deal_stage";

export async function notify(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  link?: string
): Promise<void> {
  await prisma.notification.create({ data: { userId, type, title, body, link } });
}

// Notifies every user in an organization (the sponsor/owner side of a
// listing) except the actor who triggered the event.
export async function notifyOrg(
  orgId: string,
  excludeUserId: string,
  type: NotificationType,
  title: string,
  body: string,
  link?: string
): Promise<void> {
  const members = await prisma.user.findMany({ where: { orgId, id: { not: excludeUserId } } });
  if (members.length === 0) return;
  await prisma.notification.createMany({
    data: members.map((m) => ({ userId: m.id, type, title, body, link })),
  });
}
