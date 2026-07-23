import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageSubmission } from "@/lib/authz";
import { SECTORS, INSTRUMENTS, canSubmitForReview, missingRequiredFields, type SubmissionDraft } from "@/lib/submissions";

type PatchBody = Partial<SubmissionDraft> & { action?: "submit" | "withdraw" };

function clamp(s: string | undefined, max: number): string {
  return (s ?? "").trim().slice(0, max);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { id } = await params;
  const submission = await prisma.projectSubmission.findUnique({ where: { id } });
  if (!submission || !canManageSubmission(user, submission)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ submission });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { id } = await params;
  const submission = await prisma.projectSubmission.findUnique({ where: { id } });
  if (!submission || !canManageSubmission(user, submission)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: PatchBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.action === "submit") {
    if (submission.status !== "draft" && submission.status !== "changes_requested") {
      return NextResponse.json({ error: "Only drafts or submissions with requested changes can be submitted" }, { status: 400 });
    }
    const draft: SubmissionDraft = submission;
    if (!canSubmitForReview(draft)) {
      return NextResponse.json({ error: "Missing required fields", missing: missingRequiredFields(draft) }, { status: 400 });
    }
    const updated = await prisma.projectSubmission.update({
      where: { id },
      data: { status: "submitted", reviewNotes: null },
    });
    return NextResponse.json({ ok: true, submission: updated });
  }

  if (body.action === "withdraw") {
    if (submission.status === "approved") {
      return NextResponse.json({ error: "An approved, published submission cannot be withdrawn here — contact support" }, { status: 400 });
    }
    const updated = await prisma.projectSubmission.update({ where: { id }, data: { status: "draft" } });
    return NextResponse.json({ ok: true, submission: updated });
  }

  // Field edits only permitted before/while under active owner control.
  if (submission.status === "submitted" || submission.status === "under_review" || submission.status === "approved") {
    return NextResponse.json({ error: "Cannot edit while " + submission.status.replace("_", " ") }, { status: 400 });
  }

  const updated = await prisma.projectSubmission.update({
    where: { id },
    data: {
      orgName: body.orgName !== undefined ? clamp(body.orgName, 120) : undefined,
      ownershipStatement: body.ownershipStatement !== undefined ? clamp(body.ownershipStatement, 1000) : undefined,
      title: body.title !== undefined ? clamp(body.title, 120) : undefined,
      country: body.country !== undefined ? clamp(body.country, 60) : undefined,
      region: body.region !== undefined ? clamp(body.region, 60) : undefined,
      sector: body.sector !== undefined ? (SECTORS.includes(body.sector) ? body.sector : "") : undefined,
      stage: body.stage !== undefined ? clamp(body.stage, 60) : undefined,
      raiseUsd: body.raiseUsd !== undefined ? (typeof body.raiseUsd === "number" ? Math.max(0, body.raiseUsd) : null) : undefined,
      fundingSecuredUsd: body.fundingSecuredUsd !== undefined ? (typeof body.fundingSecuredUsd === "number" ? Math.max(0, body.fundingSecuredUsd) : null) : undefined,
      sponsorContributionUsd: body.sponsorContributionUsd !== undefined ? (typeof body.sponsorContributionUsd === "number" ? Math.max(0, body.sponsorContributionUsd) : null) : undefined,
      instrument: body.instrument !== undefined ? (INSTRUMENTS.includes(body.instrument) ? body.instrument : "") : undefined,
      useOfFunds: body.useOfFunds !== undefined ? clamp(body.useOfFunds, 2000) : undefined,
      revenueModel: body.revenueModel !== undefined ? clamp(body.revenueModel, 2000) : undefined,
      financialSummary: body.financialSummary !== undefined ? clamp(body.financialSummary, 2000) : undefined,
      permitsStatus: body.permitsStatus !== undefined ? clamp(body.permitsStatus, 1000) : undefined,
      landRights: body.landRights !== undefined ? clamp(body.landRights, 1000) : undefined,
      governmentInvolvement: body.governmentInvolvement !== undefined ? clamp(body.governmentInvolvement, 1000) : undefined,
      governmentBacked: body.governmentBacked !== undefined ? !!body.governmentBacked : undefined,
      esgSummary: body.esgSummary !== undefined ? clamp(body.esgSummary, 2000) : undefined,
      keyRisks: body.keyRisks !== undefined ? clamp(body.keyRisks, 2000) : undefined,
      managementTeam: body.managementTeam !== undefined ? clamp(body.managementTeam, 2000) : undefined,
      advisors: body.advisors !== undefined ? clamp(body.advisors, 1000) : undefined,
      documentsNote: body.documentsNote !== undefined ? clamp(body.documentsNote, 1000) : undefined,
      timetable: body.timetable !== undefined ? clamp(body.timetable, 1000) : undefined,
    },
  });
  return NextResponse.json({ ok: true, submission: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { id } = await params;
  const submission = await prisma.projectSubmission.findUnique({ where: { id } });
  if (!submission || !canManageSubmission(user, submission)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (submission.status !== "draft") {
    return NextResponse.json({ error: "Only drafts can be deleted — withdraw first" }, { status: 400 });
  }
  await prisma.projectSubmission.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
