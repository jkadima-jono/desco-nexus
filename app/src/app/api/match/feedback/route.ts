import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { boundedString } from "@/lib/request-input";

// Feedback influences future ranking signals (Phase 2) — it never mutates
// the mandate itself. This route only ever creates a MatchFeedback row;
// nothing here writes to StandingMandate.
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  let body: { listingId?: string; mandateId?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const listingId = boundedString(body.listingId, 100);
  const reason = boundedString(body.reason, 1001);
  if (!listingId || !reason || reason.length > 1000) {
    return NextResponse.json({ error: "listingId and reason (1-1000 chars) required" }, { status: 400 });
  }
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  // mandateId, if provided, must belong to the requesting user — otherwise
  // silently drop it rather than let a caller attribute feedback to
  // someone else's mandate.
  let mandateId: string | null = null;
  const requestedMandateId = boundedString(body.mandateId, 100);
  if (requestedMandateId) {
    const mandate = await prisma.standingMandate.findUnique({ where: { id: requestedMandateId } });
    if (mandate && mandate.userId === user.id) mandateId = mandate.id;
  }

  const feedback = await prisma.matchFeedback.create({
    data: { userId: user.id, listingId, mandateId, reason },
  });
  return NextResponse.json({ ok: true, feedback });
}
