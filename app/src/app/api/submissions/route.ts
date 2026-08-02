import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { SECTORS, INSTRUMENTS } from "@/lib/submissions";
import { applyRateLimit, rejectUntrustedOrigin } from "@/lib/request-security";

type SubmissionBody = {
  orgName?: string;
  ownershipStatement?: string;
  title?: string;
  country?: string;
  region?: string;
  sector?: string;
  stage?: string;
  raiseUsd?: number | null;
  fundingSecuredUsd?: number | null;
  sponsorContributionUsd?: number | null;
  instrument?: string;
  useOfFunds?: string;
  revenueModel?: string;
  financialSummary?: string;
  permitsStatus?: string;
  landRights?: string;
  governmentInvolvement?: string;
  governmentBacked?: boolean;
  esgSummary?: string;
  keyRisks?: string;
  managementTeam?: string;
  advisors?: string;
  documentsNote?: string;
  timetable?: string;
};

function clamp(s: string | undefined, max: number): string {
  return (s ?? "").trim().slice(0, max);
}

function buildData(body: SubmissionBody) {
  return {
    orgName: clamp(body.orgName, 120),
    ownershipStatement: clamp(body.ownershipStatement, 1000),
    title: clamp(body.title, 120),
    country: clamp(body.country, 60),
    region: clamp(body.region, 60),
    sector: SECTORS.includes(body.sector ?? "") ? body.sector! : "",
    stage: clamp(body.stage, 60),
    raiseUsd: typeof body.raiseUsd === "number" ? Math.max(0, body.raiseUsd) : null,
    fundingSecuredUsd: typeof body.fundingSecuredUsd === "number" ? Math.max(0, body.fundingSecuredUsd) : null,
    sponsorContributionUsd: typeof body.sponsorContributionUsd === "number" ? Math.max(0, body.sponsorContributionUsd) : null,
    instrument: INSTRUMENTS.includes(body.instrument ?? "") ? body.instrument! : "",
    useOfFunds: clamp(body.useOfFunds, 2000),
    revenueModel: clamp(body.revenueModel, 2000),
    financialSummary: clamp(body.financialSummary, 2000),
    permitsStatus: clamp(body.permitsStatus, 1000),
    landRights: clamp(body.landRights, 1000),
    governmentInvolvement: clamp(body.governmentInvolvement, 1000),
    governmentBacked: !!body.governmentBacked,
    esgSummary: clamp(body.esgSummary, 2000),
    keyRisks: clamp(body.keyRisks, 2000),
    managementTeam: clamp(body.managementTeam, 2000),
    advisors: clamp(body.advisors, 1000),
    documentsNote: clamp(body.documentsNote, 1000),
    timetable: clamp(body.timetable, 1000),
  };
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const submissions = await prisma.projectSubmission.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ submissions });
}

export async function POST(req: Request) {
  const originRejection = rejectUntrustedOrigin(req);
  if (originRejection) return originRejection;
  const limited = await applyRateLimit(req, "project-submission", 6, 60 * 60_000);
  if (limited) return limited;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  let body: SubmissionBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const submission = await prisma.projectSubmission.create({
    data: { ownerId: user.id, ...buildData(body) },
  });
  return NextResponse.json({ ok: true, submission });
}
