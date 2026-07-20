import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { STAGES, isValidTransition, type Stage } from "@/lib/deals";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const { id } = await params;
  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }
  let body: { stage?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const to = body.stage as Stage;
  const reason = body.reason?.trim() ?? "";
  if (!STAGES.includes(to)) {
    return NextResponse.json({ error: "Unknown stage" }, { status: 400 });
  }
  const from = deal.stage as Stage;
  if (!isValidTransition(from, to)) {
    return NextResponse.json(
      { error: "Invalid transition " + from + " → " + to + ". Forward moves advance one stage; backward moves are rollbacks." },
      { status: 422 }
    );
  }
  const backward = STAGES.indexOf(to) < STAGES.indexOf(from);
  if (backward && !reason) {
    return NextResponse.json(
      { error: "Rollback requires a reason" },
      { status: 422 }
    );
  }
  const history = JSON.parse(deal.history || "[]") as unknown[];
  history.push({
    from,
    to,
    by: user.fullName,
    reason: reason || null,
    at: new Date().toISOString(),
  });
  const updated = await prisma.deal.update({
    where: { id },
    data: { stage: to, history: JSON.stringify(history) },
  });
  return NextResponse.json({ ok: true, deal: { id: updated.id, stage: updated.stage } });
}
