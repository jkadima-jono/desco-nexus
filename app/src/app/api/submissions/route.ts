import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { SECTORS, INSTRUMENTS } from "@/lib/submissions";
import { applyRateLimit, rejectUntrustedOrigin } from "@/lib/request-security";
import { boundedString, nonNegativeFiniteNumber } from "@/lib/request-input";

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

function buildData(body: SubmissionBody) {
  return {
    orgName: boundedString(body.orgName, 120),
    ownershipStatement: boundedString(body.ownershipStatement, 1000),
    title: boundedString(body.title, 120),
    country: boundedString(body.country, 60),
    region: boundedString(body.region, 60),
    sector: SECTORS.includes(body.sector ?? "") ? body.sector! : "",
    stage: boundedString(body.stage, 60),
    raiseUsd: nonNegativeFiniteNumber(body.raiseUsd),
    fundingSecuredUsd: nonNegativeFiniteNumber(body.fundingSecuredUsd),
    sponsorContributionUsd: nonNegativeFiniteNumber(body.sponsorContributionUsd),
    instrument: INSTRUMENTS.includes(body.instrument ?? "") ? body.instrument! : "",
    useOfFunds: boundedString(body.useOfFunds, 2000),
    revenueModel: boundedString(body.revenueModel, 2000),
    financialSummary: boundedString(body.financialSummary, 2000),
    permitsStatus: boundedString(body.permitsStatus, 1000),
    landRights: boundedString(body.landRights, 1000),
    governmentInvolvement: boundedString(body.governmentInvolvement, 1000),
    governmentBacked: body.governmentBacked === true,
    esgSummary: boundedString(body.esgSummary, 2000),
    keyRisks: boundedString(body.keyRisks, 2000),
    managementTeam: boundedString(body.managementTeam, 2000),
    advisors: boundedString(body.advisors, 1000),
    documentsNote: boundedString(body.documentsNote, 1000),
    timetable: boundedString(body.timetable, 1000),
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
