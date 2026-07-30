import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageListing, unauthorized, forbidden } from "@/lib/authz";
import { projectHref } from "@/lib/project-slugs";
import { enqueueOutbox } from "@/lib/outbox";
import { processOutbox } from "@/lib/outbox-worker";
import { logOperationalEvent } from "@/lib/observability";

// Sponsor/admin confirm a proposed slot (or decline); the requester may
// cancel their own request while it's still pending.
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  const { id } = await params;
  const meeting = await prisma.meeting.findUnique({ where: { id }, include: { listing: true } });
  if (!meeting) return NextResponse.json({ error: "Meeting not found" }, { status: 404 });

  let body: { status?: string; confirmedSlot?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const canManage = canManageListing(user, meeting.listing) || user.role === "admin";
  const isRequester = meeting.requesterId === user.id;
  if (!canManage && !isRequester) return forbidden();

  if (meeting.status !== "requested") {
    return NextResponse.json({ error: "Meeting already " + meeting.status }, { status: 422 });
  }

  if (body.status === "cancelled") {
    if (!isRequester) return forbidden();
  } else if (body.status === "confirmed" || body.status === "declined") {
    if (!canManage) return forbidden();
  } else {
    return NextResponse.json({ error: "status must be confirmed|declined|cancelled" }, { status: 400 });
  }

  const proposedSlots = JSON.parse(meeting.proposedSlots) as string[];
  if (body.status === "confirmed") {
    if (!body.confirmedSlot || !proposedSlots.includes(body.confirmedSlot)) {
      return NextResponse.json({ error: "confirmedSlot must be one of the proposed slots" }, { status: 400 });
    }
  }

  const link = projectHref(meeting.listingId) + "#meetings";
  const updated = await prisma.$transaction(async (tx) => {
    const changed = await tx.meeting.updateMany({
      where: { id, status: "requested" },
      data: {
        status: body.status,
        confirmedSlot: body.status === "confirmed" ? new Date(body.confirmedSlot!) : null,
      },
    });
    if (changed.count !== 1) return null;
    const common = { type: "", title: "", body: "", link };
    if (body.status === "confirmed") {
      Object.assign(common, { type: "meeting_confirmed", title: "Meeting confirmed", body: `Your meeting request for "${meeting.listing.title}" was confirmed.` });
      await enqueueOutbox(tx, { type: "notification.user", aggregateId: id, eventKey: `meeting:${id}:confirmed`, payload: { ...common, userId: meeting.requesterId } });
    } else if (body.status === "declined") {
      Object.assign(common, { type: "meeting_declined", title: "Meeting declined", body: `Your meeting request for "${meeting.listing.title}" was declined.` });
      await enqueueOutbox(tx, { type: "notification.user", aggregateId: id, eventKey: `meeting:${id}:declined`, payload: { ...common, userId: meeting.requesterId } });
    } else {
      Object.assign(common, { type: "meeting_cancelled", title: "Meeting request cancelled", body: `${meeting.listing.title}: the requester cancelled their meeting request.` });
      await enqueueOutbox(tx, { type: "notification.org", aggregateId: id, eventKey: `meeting:${id}:cancelled`, payload: { ...common, orgId: meeting.listing.orgId, excludeUserId: user.id } });
    }
    return tx.meeting.findUniqueOrThrow({ where: { id } });
  });
  if (!updated) {
    return NextResponse.json({ error: "Meeting was updated by another request. Refresh and retry." }, { status: 409 });
  }
  await processOutbox(10).catch((error) => {
    logOperationalEvent("warn", "outbox.opportunistic_processing_failed", {
      source: "meeting",
      errorType: error instanceof Error ? error.name : "unknown",
    });
  });

  return NextResponse.json({ ok: true, meeting: updated });
}
