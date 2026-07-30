import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageListing, unauthorized } from "@/lib/authz";
import { notifyOrg } from "@/lib/notifications";
import { projectHref } from "@/lib/project-slugs";
import { institutionalAccessDecision } from "@/lib/institutional-access";
import { RESTRICTED_ACCESS_NOTICE_VERSION } from "@/lib/restricted-access";
import { isPublicOpportunityId, PUBLIC_LISTING_STATUS } from "@/lib/public-listings";

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
  let body: {
    listingId?: string;
    proposedSlots?: string[];
    note?: string;
    acknowledgedRestrictedAccess?: boolean;
    noticeVersion?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { listingId } = body;
  if (!listingId) return NextResponse.json({ error: "listingId required" }, { status: 400 });
  if (user.role !== "investor") {
    return NextResponse.json({ error: "Approved investor workspace access is required" }, { status: 403 });
  }
  const listing = await prisma.listing.findFirst({
    where: { id: listingId, publicationStatus: PUBLIC_LISTING_STATUS },
  });
  if (!isPublicOpportunityId(listingId)) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (
    body.acknowledgedRestrictedAccess !== true ||
    body.noticeVersion !== RESTRICTED_ACCESS_NOTICE_VERSION
  ) {
    return NextResponse.json({ error: "Current non-binding introduction acknowledgement is required" }, { status: 428 });
  }
  const decision = await institutionalAccessDecision(user.id);
  if (!decision.eligible) {
    return NextResponse.json({ error: decision.reason }, { status: 403 });
  }

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
  await prisma.accessAcknowledgement.create({
    data: {
      userId: user.id,
      listingId,
      action: "meeting_request",
      noticeVersion: RESTRICTED_ACCESS_NOTICE_VERSION,
      jurisdiction: decision.profile.classificationJurisdiction!,
      classification: decision.profile.investorClassification,
    },
  });
  if (listing.orgId) {
    await notifyOrg(
      listing.orgId,
      user.id,
      "meeting_requested",
      "New meeting request",
      user.fullName + " requested a meeting for \"" + listing.title + "\".",
      projectHref(listingId) + "#meetings"
    );
  }
  return NextResponse.json({ ok: true, meeting });
}
