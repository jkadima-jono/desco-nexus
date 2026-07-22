import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageListing, unauthorized } from "@/lib/authz";

const MAX_SLOTS = 5;

// GET ?listingId=x — the listing's sponsor/admin sees every request for
// that listing; anyone else sees only their own requests for it.
export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  const listingId = new URL(req.url).searchParams.get("listingId");
  if (!listingId) return NextResponse.json({ error: "listingId required" }, { status: 400 });
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  const canSeeAll = canManageListing(user, listing) || user.role === "admin";
  const meetings = await prisma.meeting.findMany({
    where: canSeeAll ? { listingId } : { listingId, requesterId: user.id },
    include: { requester: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({
    meetings: meetings.map((m) => ({
      id: m.id,
      listingId: m.listingId,
      requesterName: m.requester.fullName,
      requesterEmail: m.requester.email,
      proposedSlots: JSON.parse(m.proposedSlots) as string[],
      note: m.note,
      status: m.status,
      confirmedSlot: m.confirmedSlot,
      createdAt: m.createdAt,
    })),
  });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  let body: { listingId?: string; proposedSlots?: string[]; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { listingId } = body;
  if (!listingId) return NextResponse.json({ error: "listingId required" }, { status: 400 });
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  const slots = (body.proposedSlots ?? [])
    .filter((s) => typeof s === "string" && !isNaN(Date.parse(s)))
    .slice(0, MAX_SLOTS);
  if (slots.length === 0) {
    return NextResponse.json({ error: "At least one proposed time is required" }, { status: 400 });
  }

  const meeting = await prisma.meeting.create({
    data: {
      listingId,
      requesterId: user.id,
      proposedSlots: JSON.stringify(slots),
      note: (body.note ?? "").trim().slice(0, 500),
    },
  });
  return NextResponse.json({ ok: true, meeting });
}
