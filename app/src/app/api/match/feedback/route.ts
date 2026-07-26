import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

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

  const listingId = body.listingId?.trim();
  const reason = body.reason?.trim();
  if (!listingId || !reason || reason.length > 1000) {
    return NextResponse.json({ error: "listingId and reason (1-1000 chars) required" }, { status: 400 });
  }
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  // mandateId, if provided, must belong to the requesting user — otherwise
  // silently drop it rather than let a caller attribute feedback to
  // someone else's mandate.
  let mandateId: string | null = null;
  if (body.mandateId) {
    const mandate = await prisma.standingMandate.findUnique({ where: { id: body.mandateId } });
    if (mandate && mandate.userId === user.id) mandateId = mandate.id;
  }

  const feedback = await prisma.matchFeedback.create({
    data: { userId: user.id, listingId, mandateId, reason },
  });
  return NextResponse.json({ ok: true, feedback });
}
