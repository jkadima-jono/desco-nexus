import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { STAGES, isValidTransition, requiresReason, type Stage } from "@/lib/deals";
import { canManageDeal } from "@/lib/authz";
import { notify } from "@/lib/notifications";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const { id } = await params;
  const deal = await prisma.deal.findUnique({ where: { id }, include: { listing: true } });
  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }
  if (!canManageDeal(user, deal)) {
    return NextResponse.json({ error: "Not permitted for your role" }, { status: 403 });
  }
  let body: { stage?: string; reason?: string; note?: string; dueDate?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const data: { stage?: string; history?: string; dueDate?: Date | null; decisionNotes?: string } = {};

  if (body.stage !== undefined) {
    const to = body.stage as Stage;
    const reason = body.reason?.trim() ?? "";
    if (!STAGES.includes(to)) {
      return NextResponse.json({ error: "Unknown stage" }, { status: 400 });
    }
    const from = deal.stage as Stage;
    if (!isValidTransition(from, to)) {
      return NextResponse.json(
        { error: "Invalid transition " + from + " → " + to + ". Forward moves advance one stage; backward moves are rollbacks; \"Passed or Withdrawn\" is reachable from any active stage." },
        { status: 422 }
      );
    }
    if (requiresReason(from, to) && !reason) {
      return NextResponse.json(
        { error: "This transition requires a reason (rollback, rejection, withdrawal, or closed-lost outcome)" },
        { status: 422 }
      );
    }
    const history = JSON.parse(deal.history || "[]") as unknown[];
    history.push({ from, to, by: user.fullName, reason: reason || null, at: new Date().toISOString() });
    data.stage = to;
    data.history = JSON.stringify(history);
  }

  if (body.dueDate !== undefined) {
    data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  }

  if (body.note !== undefined && body.note.trim()) {
    const notes = JSON.parse(deal.decisionNotes || "[]") as unknown[];
    notes.push({ by: user.fullName, note: body.note.trim().slice(0, 2000), at: new Date().toISOString() });
    data.decisionNotes = JSON.stringify(notes);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const updated = await prisma.deal.update({ where: { id }, data });

  if (data.stage) {
    const engaged = await prisma.matchAction.findMany({
      where: { listingId: deal.listingId, userId: { not: user.id } },
      distinct: ["userId"],
      select: { userId: true },
    });
    for (const { userId } of engaged) {
      await notify(
        userId,
        "deal_stage",
        "Stage updated",
        "\"" + deal.title + "\" moved to \"" + data.stage + "\".",
        "/project/" + deal.listingId
      );
    }
  }

  return NextResponse.json({ ok: true, deal: { id: updated.id, stage: updated.stage } });
}
