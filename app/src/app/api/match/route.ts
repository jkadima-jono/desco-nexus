import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { STAGES, type Stage } from "@/lib/deals";

const ACTIONS = new Set(["interested", "pass", "saved", "follow", "info_requested", "dataroom_requested"]);

// Investor actions map onto the same 12-stage pipeline used by
// /api/deals/[id] — one lifecycle, not a parallel one. "pass"/"follow"
// don't advance the deal stage (a pass is recorded as a MatchAction only;
// a deal that's already progressing shouldn't be created retroactively by
// a pass).
const ACTION_STAGE: Partial<Record<string, Stage>> = {
  saved: "Saved",
  interested: "Interested",
  info_requested: "Information Requested",
  dataroom_requested: "Data-Room Requested",
};

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  let body: { listingId?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { listingId, action } = body;
  if (!listingId || !action || !ACTIONS.has(action)) {
    return NextResponse.json(
      { error: "listingId and action (interested|pass|saved|follow|info_requested|dataroom_requested) required" },
      { status: 400 }
    );
  }

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  await prisma.matchAction.create({
    data: {
      userId: user.id,
      listingId,
      action,
      matchScore: listing.matchScore,
    },
  });

  let dealCreated = false;
  const targetStage = ACTION_STAGE[action];
  if (targetStage) {
    const amount = "$" + Math.round(listing.raiseUsd / 1_000_000) + "M";
    const existing = await prisma.deal.findUnique({
      where: { listingId_title: { listingId, title: listing.title } },
    });
    const targetIdx = STAGES.indexOf(targetStage);
    if (!existing) {
      await prisma.deal.create({
        data: {
          listingId,
          title: listing.title,
          flag: listing.flag,
          amount,
          stage: targetStage,
          owner: user.fullName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
          nextStep: "Awaiting sponsor response",
          history: JSON.stringify([{ from: null, to: targetStage, by: user.fullName, reason: null, at: new Date().toISOString() }]),
        },
      });
      dealCreated = true;
    } else {
      // Only ever advance forward via this investor-driven path — never
      // regress a deal that's already further along, and never overwrite
      // a terminal (Closed / Passed or Withdrawn) outcome.
      const currentIdx = STAGES.indexOf(existing.stage as Stage);
      const isTerminal = existing.stage === "Closed" || existing.stage === "Passed or Withdrawn";
      if (!isTerminal && targetIdx > currentIdx) {
        const history = JSON.parse(existing.history || "[]") as unknown[];
        history.push({ from: existing.stage, to: targetStage, by: user.fullName, reason: null, at: new Date().toISOString() });
        await prisma.deal.update({
          where: { id: existing.id },
          data: { stage: targetStage, history: JSON.stringify(history) },
        });
      }
    }
  }

  return NextResponse.json({ ok: true, dealCreated });
}
