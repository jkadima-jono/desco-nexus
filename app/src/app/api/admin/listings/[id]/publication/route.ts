import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { publicationContentHash } from "@/lib/publication-content";
import { boundedString } from "@/lib/request-input";

type PublicationAction = "record_clearance" | "publish" | "pause" | "withdraw" | "archive";

function appendHistory(
  historyJson: string,
  entry: { by: string; action: PublicationAction; reason?: string; at: string },
) {
  try {
    const history = JSON.parse(historyJson);
    return JSON.stringify([...(Array.isArray(history) ? history : []), entry]);
  } catch {
    return JSON.stringify([entry]);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Administrator required" }, { status: 403 });

  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { docs: true, images: true, sponsorConsents: true, legalClearances: true, relatedPartyReviews: true },
  });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  let body: {
    action?: PublicationAction;
    reason?: string;
    sponsorApprovalNote?: string;
    legalClearanceScope?: string;
    relatedPartyDisclosure?: string;
    relatedPartyType?: string | null;
    relatedParty?: boolean;
    sponsorSignatoryName?: string;
    sponsorSignatoryCapacity?: string;
    sponsorApprovalEvidenceRef?: string;
    legalCounselName?: string;
    legalJurisdiction?: string;
    legalApprovalEvidenceRef?: string;
    relatedPartyReviewerName?: string;
    relatedPartyReviewerIndependence?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const action = boundedString(body.action, 30) as PublicationAction;

  if (action === "record_clearance") {
    const sponsorApprovalNote = boundedString(body.sponsorApprovalNote, 2000);
    const legalClearanceScope = boundedString(body.legalClearanceScope, 2000);
    const relatedPartyDisclosure = boundedString(body.relatedPartyDisclosure, 2000);
    const sponsorSignatoryName = boundedString(body.sponsorSignatoryName, 200);
    const sponsorSignatoryCapacity = boundedString(body.sponsorSignatoryCapacity, 200);
    const sponsorApprovalEvidenceRef = boundedString(body.sponsorApprovalEvidenceRef, 300);
    const legalCounselName = boundedString(body.legalCounselName, 200);
    const legalJurisdiction = boundedString(body.legalJurisdiction, 200);
    const legalApprovalEvidenceRef = boundedString(body.legalApprovalEvidenceRef, 300);
    const relatedPartyReviewerName = boundedString(body.relatedPartyReviewerName, 200);
    const relatedPartyReviewerIndependence = boundedString(body.relatedPartyReviewerIndependence, 1000);
    const relatedPartyType = boundedString(body.relatedPartyType, 300);
    if (
      !sponsorApprovalNote ||
      !legalClearanceScope ||
      !relatedPartyDisclosure ||
      !sponsorSignatoryName ||
      !sponsorSignatoryCapacity ||
      !sponsorApprovalEvidenceRef ||
      !legalCounselName ||
      !legalJurisdiction ||
      !legalApprovalEvidenceRef ||
      !relatedPartyReviewerName ||
      !relatedPartyReviewerIndependence
    ) {
      return NextResponse.json(
        { error: "Separate sponsor, legal and related-party reviewer identities, scope and evidence references are required" },
        { status: 400 },
      );
    }
    if (typeof body.relatedParty !== "boolean") {
      return NextResponse.json({ error: "A true or false related-party conclusion is required" }, { status: 400 });
    }
    if (body.relatedParty && !relatedPartyType) {
      return NextResponse.json({ error: "The relationship type is required for a related-party listing" }, { status: 400 });
    }
    const relatedParty = body.relatedParty;
    const reviewerIdentities = [
      sponsorSignatoryName.toLowerCase(),
      legalCounselName.toLowerCase(),
      relatedPartyReviewerName.toLowerCase(),
    ];
    if (
      new Set(reviewerIdentities).size !== reviewerIdentities.length ||
      reviewerIdentities.includes(user.fullName.trim().toLowerCase())
    ) {
      return NextResponse.json(
        { error: "Sponsor, counsel and related-party reviewer must be distinct from each other and from the recording administrator" },
        { status: 409 },
      );
    }
    const at = new Date();
    const contentHash = publicationContentHash({
      ...listing,
      relatedParty,
      relatedPartyType: relatedParty ? relatedPartyType : null,
      relatedPartyDisclosure,
    });
    const updated = await prisma.$transaction(async (tx) => {
      await tx.sponsorConsent.updateMany({
        where: { listingId: id, contentVersion: listing.contentVersion, revokedAt: null },
        data: { revokedAt: at },
      });
      await tx.legalClearance.updateMany({
        where: { listingId: id, contentVersion: listing.contentVersion, revokedAt: null },
        data: { revokedAt: at },
      });
      await tx.relatedPartyReview.updateMany({
        where: { listingId: id, contentVersion: listing.contentVersion, revokedAt: null },
        data: { revokedAt: at },
      });
      await tx.sponsorConsent.create({
        data: {
          listingId: id,
          contentVersion: listing.contentVersion,
          contentHash,
          signatoryName: sponsorSignatoryName,
          signatoryCapacity: sponsorSignatoryCapacity,
          approvalEvidenceRef: sponsorApprovalEvidenceRef,
          recordedBy: user.id,
          approvedAt: at,
        },
      });
      await tx.legalClearance.create({
        data: {
          listingId: id,
          contentVersion: listing.contentVersion,
          contentHash,
          jurisdiction: legalJurisdiction,
          scope: legalClearanceScope,
          counselName: legalCounselName,
          approvalEvidenceRef: legalApprovalEvidenceRef,
          recordedBy: user.id,
          clearedAt: at,
        },
      });
      await tx.relatedPartyReview.create({
        data: {
          listingId: id,
          contentVersion: listing.contentVersion,
          contentHash,
          relatedParty,
          relationshipType: relatedParty ? relatedPartyType : null,
          publicDisclosure: relatedPartyDisclosure,
          reviewerName: relatedPartyReviewerName,
          reviewerIndependence: relatedPartyReviewerIndependence,
          recordedBy: user.id,
          reviewedAt: at,
        },
      });
      return tx.listing.update({
        where: { id },
        data: {
          sponsorApprovedAt: at,
          sponsorApprovedBy: user.id,
          sponsorApprovalVersion: listing.contentVersion,
          sponsorApprovalNote,
          legalClearedAt: at,
          legalClearedBy: user.id,
          legalClearanceScope,
          relatedParty,
          relatedPartyType: relatedParty ? relatedPartyType : null,
          relatedPartyDisclosure,
          relatedPartyReviewedAt: at,
          relatedPartyReviewedBy: user.id,
          publicationHistory: appendHistory(listing.publicationHistory, {
            by: user.id,
            action: "record_clearance",
            reason: "Separate sponsor approval, legal clearance and related-party review records created",
            at: at.toISOString(),
          }),
        },
      });
    });
    return NextResponse.json({ ok: true, listing: updated });
  }

  if (action === "publish") {
    const currentContentHash = publicationContentHash(listing);
    const hasCurrentSponsorConsent = listing.sponsorConsents.some(
      (approval) =>
        approval.contentVersion === listing.contentVersion &&
        approval.contentHash === currentContentHash &&
        !approval.revokedAt,
    );
    const hasCurrentLegalClearance = listing.legalClearances.some(
      (approval) =>
        approval.contentVersion === listing.contentVersion &&
        approval.contentHash === currentContentHash &&
        !approval.revokedAt,
    );
    const hasCurrentRelatedPartyReview = listing.relatedPartyReviews.some(
      (approval) =>
        approval.contentVersion === listing.contentVersion &&
        approval.contentHash === currentContentHash &&
        !approval.revokedAt,
    );
    if (!hasCurrentSponsorConsent || !hasCurrentLegalClearance || !hasCurrentRelatedPartyReview) {
      return NextResponse.json({ error: "Current separate sponsor, legal and related-party approval records are required" }, { status: 409 });
    }
    if (!listing.relatedPartyReviewedAt || !listing.relatedPartyReviewedBy || !listing.relatedPartyDisclosure.trim()) {
      return NextResponse.json({ error: "Related-party review is required before publication" }, { status: 409 });
    }
    if (!listing.sponsorApprovedAt || !listing.sponsorApprovedBy || listing.sponsorApprovalVersion !== listing.contentVersion) {
      return NextResponse.json({ error: "Sponsor approval for the current content version is required before publication" }, { status: 409 });
    }
    if (!listing.legalClearedAt || !listing.legalClearedBy || !listing.legalClearanceScope.trim()) {
      return NextResponse.json({ error: "Legal clearance with a recorded scope is required before publication" }, { status: 409 });
    }
    const hasUsableSource = listing.docs.some(
      (document) =>
        document.lifecycle === "approved" &&
        !!document.storageKey &&
        !!document.sha256 &&
        !!document.approvedAt &&
        !!document.approvedBy &&
        (document.scanStatus === "clean" || document.scanStatus === "not_required"),
    );
    if (!hasUsableSource) {
      return NextResponse.json({ error: "At least one controlled, checksummed and approved source document is required before publication" }, { status: 409 });
    }
    const at = new Date();
    const updated = await prisma.listing.update({
      where: { id },
      data: {
        publicationStatus: "public_teaser",
        designation: listing.designation === "removed" ? "candidate" : listing.designation,
        publishedAt: listing.publishedAt ?? at,
        lastPublishedAt: at,
        publishedBy: user.id,
        publicationHistory: appendHistory(listing.publicationHistory, {
          by: user.id,
          action: "publish",
          at: at.toISOString(),
        }),
      },
    });
    return NextResponse.json({ ok: true, listing: updated });
  }

  if (action === "pause" || action === "withdraw" || action === "archive") {
    const reason = boundedString(body.reason, 2000);
    if (!reason) return NextResponse.json({ error: "A reason is required" }, { status: 400 });
    const publicationStatus =
      action === "pause" ? "paused" : action === "withdraw" ? "withdrawn" : "archived";
    const at = new Date();
    const updated = await prisma.listing.update({
      where: { id },
      data: {
        publicationStatus,
        designation: action === "pause" ? "paused" : "removed",
        contentVersion: { increment: 1 },
        publicationHistory: appendHistory(listing.publicationHistory, {
          by: user.id,
          action,
          reason,
          at: at.toISOString(),
        }),
      },
    });
    return NextResponse.json({ ok: true, reason, listing: updated });
  }

  return NextResponse.json({ error: "action must be record_clearance|publish|pause|withdraw|archive" }, { status: 400 });
}
