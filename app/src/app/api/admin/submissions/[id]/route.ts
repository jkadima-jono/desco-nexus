import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canReviewSubmissions } from "@/lib/authz";
import { DESCO_COLORS, sectorColor } from "@/lib/theme";

function slugify(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "project";
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 1;
  while (await prisma.listing.findUnique({ where: { id: slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

type ReviewBody = { action?: "approve" | "reject" | "request_changes"; reason?: string };

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (!canReviewSubmissions(user)) return NextResponse.json({ error: "Not permitted for your role" }, { status: 403 });

  const { id } = await params;
  const submission = await prisma.projectSubmission.findUnique({ where: { id } });
  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (submission.status !== "submitted" && submission.status !== "under_review") {
    return NextResponse.json({ error: "Only submitted or under-review items can be reviewed" }, { status: 400 });
  }

  let body: ReviewBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.action === "reject" || body.action === "request_changes") {
    const reason = body.reason?.trim() ?? "";
    if (!reason) return NextResponse.json({ error: "A reason is required" }, { status: 400 });
    const updated = await prisma.projectSubmission.update({
      where: { id },
      data: {
        status: body.action === "reject" ? "rejected" : "changes_requested",
        reviewedBy: user.id,
        reviewNotes: reason,
      },
    });
    return NextResponse.json({ ok: true, submission: updated });
  }

  if (body.action === "approve") {
    const org = await prisma.organization.upsert({
      where: { name: submission.orgName },
      update: {},
      create: { name: submission.orgName, type: "seeker", country: submission.country || "DR Congo" },
    });
    const slug = await uniqueSlug(slugify(submission.title));
    const listing = await prisma.listing.create({
      data: {
        id: slug,
        orgId: org.id,
        title: submission.title,
        sector: submission.sector,
        sectorColor: sectorColor(submission.sector) ?? DESCO_COLORS.charcoal,
        country: submission.country || "DR Congo",
        flag: submission.country === "DR Congo" || !submission.country ? "🇨🇩" : "🏳",
        raiseUsd: submission.raiseUsd ?? 0,
        instrument: submission.instrument,
        stage: submission.stage,
        irr: "Sponsor-provided — see project page for terms",
        summary: submission.ownershipStatement || submission.useOfFunds,
        verified: false,
        governmentBacked: submission.governmentBacked,
        // Legacy schema placeholders. Public ranking and disclosure do not use
        // these values; replace them when the database fields are migrated.
        matchScore: 50,
        readiness: 50,
        esg: 50,
        risk: 50,
        highlights: "[]",
        whyMatch: "",
        useOfFunds: submission.useOfFunds || null,
        fundingSecuredUsd: submission.fundingSecuredUsd,
        sponsorContributionUsd: submission.sponsorContributionUsd,
        publicationStatus: "internal_review",
        sourceSubmissionId: submission.id,
        contentVersion: 1,
      },
    });
    const updated = await prisma.projectSubmission.update({
      where: { id },
      data: { status: "approved", reviewedBy: user.id, reviewNotes: null, publishedListingId: listing.id },
    });
    return NextResponse.json({ ok: true, submission: updated, listingId: listing.id });
  }

  return NextResponse.json({ error: "action must be approve|reject|request_changes" }, { status: 400 });
}
