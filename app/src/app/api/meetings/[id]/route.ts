import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageListing, unauthorized, forbidden } from "@/lib/authz";
import { notify, notifyOrg } from "@/lib/notifications";

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

  const updated = await prisma.meeting.update({
    where: { id },
    data: {
      status: body.status,
      confirmedSlot: body.status === "confirmed" ? new Date(body.confirmedSlot!) : null,
    },
  });

  const link = "/project/" + meeting.listingId + "#meetings";
  if (body.status === "confirmed") {
    await notify(meeting.requesterId, "meeting_confirmed", "Meeting confirmed", "Your meeting request for \"" + meeting.listing.title + "\" was confirmed.", link);
  } else if (body.status === "declined") {
    await notify(meeting.requesterId, "meeting_declined", "Meeting declined", "Your meeting request for \"" + meeting.listing.title + "\" was declined.", link);
  } else if (body.status === "cancelled") {
    await notifyOrg(meeting.listing.orgId, user.id, "meeting_cancelled", "Meeting request cancelled", meeting.listing.title + ": the requester cancelled their meeting request.", link);
  }

  return NextResponse.json({ ok: true, meeting: updated });
}
