import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { STAGES, type Stage } from "@/lib/deals";
import { canRequestDataRoom, forbidden } from "@/lib/authz";
import { isPublicOpportunityId, PUBLIC_LISTING_STATUS } from "@/lib/public-listings";
import { institutionalAccessDecision } from "@/lib/institutional-access";
import { DEMO_NDA_HASH, DEMO_NDA_VERSION, RESTRICTED_ACCESS_NOTICE_VERSION } from "@/lib/restricted-access";
import { Prisma } from "@prisma/client";
import { applyRateLimit, rejectUntrustedOrigin } from "@/lib/request-security";
import { boundedString } from "@/lib/request-input";

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
  const originRejection = rejectUntrustedOrigin(req);
  if (originRejection) return originRejection;
  const limited = await applyRateLimit(req, "match-action", 30, 60_000);
  if (limited) return limited;
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  let body: { listingId?: string; action?: string; requestKey?: string; acknowledgedRestrictedAccess?: boolean; noticeVersion?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const listingId = boundedString(body.listingId, 100);
  const action = boundedString(body.action, 40);
  if (!listingId || !action || !ACTIONS.has(action)) {
    return NextResponse.json(
      { error: "listingId and action (interested|pass|saved|follow|info_requested|dataroom_requested) required" },
      { status: 400 }
    );
  }
  const requestKey = boundedString(body.requestKey, 101);
  if (!requestKey || requestKey.length < 16 || requestKey.length > 100) {
    return NextResponse.json({ error: "A valid requestKey is required." }, { status: 400 });
  }

  if (action === "dataroom_requested" && !canRequestDataRoom(user)) {
    return forbidden();
  }

  if (!isPublicOpportunityId(listingId)) {
    return NextResponse.json({ error: "Public opportunity not found" }, { status: 404 });
  }
  const listing = await prisma.listing.findFirst({
    where: { id: listingId, publicationStatus: PUBLIC_LISTING_STATUS },
  });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  let restrictedDecision: Awaited<ReturnType<typeof institutionalAccessDecision>> | null = null;
  if (action === "dataroom_requested" || action === "info_requested") {
    if (
      body.acknowledgedRestrictedAccess !== true ||
      body.noticeVersion !== RESTRICTED_ACCESS_NOTICE_VERSION
    ) {
      return NextResponse.json(
        { error: "Current restricted-access acknowledgement is required." },
        { status: 428 },
      );
    }
    restrictedDecision = await institutionalAccessDecision(user.id);
    if (!restrictedDecision.eligible) {
      return NextResponse.json({ error: restrictedDecision.reason }, { status: 403 });
    }
  }

  const dealCreated = await prisma.$transaction(async (tx) => {
    const prior = await tx.matchAction.findUnique({ where: { requestKey }, select: { id: true } });
    if (prior) return false;
    if (restrictedDecision?.eligible) {
      await tx.accessAcknowledgement.create({
        data: {
          userId: user.id,
          listingId,
          action: action === "dataroom_requested" ? "data_room_request" : "information_request",
          noticeVersion: RESTRICTED_ACCESS_NOTICE_VERSION,
          jurisdiction: restrictedDecision.profile.classificationJurisdiction!,
          classification: restrictedDecision.profile.investorClassification,
        },
      });
      const demoStatusAllowed = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";
      if (action === "dataroom_requested" && demoStatusAllowed && restrictedDecision.profile.kybStatus === "demo_verified") {
        const existingDemoNda = await tx.ndaExecution.findFirst({
          where: { userId: user.id, listingId, termsVersion: DEMO_NDA_VERSION, status: "demo_executed", revokedAt: null },
          select: { id: true },
        });
        if (!existingDemoNda) {
          await tx.ndaExecution.create({
            data: {
              userId: user.id, listingId, termsVersion: DEMO_NDA_VERSION, termsHash: DEMO_NDA_HASH,
              signatoryName: user.fullName, signatoryCapacity: "Fictional demo persona",
              status: "demo_executed", executionRef: "demo-environment", executedAt: new Date(),
            },
          });
        }
      }
    }
    await tx.matchAction.create({
      data: { requestKey, userId: user.id, listingId, action, matchScore: listing.matchScore },
    });
    if (action === "saved") {
      await tx.savedOpportunity.upsert({
        where: { userId_listingId: { userId: user.id, listingId } },
        update: {},
        create: { userId: user.id, listingId },
      });
    }

    const targetStage = ACTION_STAGE[action];
    if (!targetStage) return false;
    const amount = listing.currentCapitalAskUsd != null && listing.currentCapitalAskUsd > 0
      ? "$" + Math.round(listing.currentCapitalAskUsd / 1_000_000) + "M"
      : "Not disclosed";
    const existing = await tx.deal.findUnique({
      where: { investorId_listingId_title: { investorId: user.id, listingId, title: listing.title } },
    });
    const targetIdx = STAGES.indexOf(targetStage);
    if (!existing) {
      await tx.deal.create({
        data: {
          listingId,
          investorId: user.id,
          title: listing.title,
          flag: listing.flag,
          amount,
          stage: targetStage,
          owner: user.fullName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
          nextStep: "Awaiting sponsor response",
          history: JSON.stringify([{ from: null, to: targetStage, by: user.fullName, reason: null, at: new Date().toISOString() }]),
        },
      });
      return true;
    } else {
      // Only ever advance forward via this investor-driven path — never
      // regress a deal that's already further along, and never overwrite
      // a terminal (Closed / Passed or Withdrawn) outcome.
      const currentIdx = STAGES.indexOf(existing.stage as Stage);
      const isTerminal = existing.stage === "Closed" || existing.stage === "Passed or Withdrawn";
      if (!isTerminal && targetIdx > currentIdx) {
        const history = JSON.parse(existing.history || "[]") as unknown[];
        history.push({ from: existing.stage, to: targetStage, by: user.fullName, reason: null, at: new Date().toISOString() });
        await tx.deal.updateMany({
          where: { id: existing.id, updatedAt: existing.updatedAt },
          data: { stage: targetStage, history: JSON.stringify(history) },
        });
      }
    }
    return false;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

  return NextResponse.json({ ok: true, dealCreated });
}
