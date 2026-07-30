import type { Prisma } from "@prisma/client";

function appendHistory(
  historyJson: string,
  entry: { by: string; action: string; reason: string; at: string },
) {
  try {
    const history = JSON.parse(historyJson);
    return JSON.stringify([...(Array.isArray(history) ? history : []), entry]);
  } catch {
    return JSON.stringify([entry]);
  }
}

/**
 * Any public image mutation creates a new controlled-content version.
 * Existing attestations remain in the audit trail but are revoked, and a
 * published teaser returns to internal review until the new version is cleared.
 */
export async function invalidatePublicationForImageChange(
  tx: Prisma.TransactionClient,
  listingId: string,
  actorId: string,
  reason: string,
) {
  const listing = await tx.listing.findUniqueOrThrow({
    where: { id: listingId },
    select: { publicationStatus: true, publicationHistory: true },
  });
  const at = new Date();

  await Promise.all([
    tx.sponsorConsent.updateMany({
      where: { listingId, revokedAt: null },
      data: { revokedAt: at },
    }),
    tx.legalClearance.updateMany({
      where: { listingId, revokedAt: null },
      data: { revokedAt: at },
    }),
    tx.relatedPartyReview.updateMany({
      where: { listingId, revokedAt: null },
      data: { revokedAt: at },
    }),
  ]);

  await tx.listing.update({
    where: { id: listingId },
    data: {
      contentVersion: { increment: 1 },
      publicationStatus:
        listing.publicationStatus === "public_teaser"
          ? "internal_review"
          : listing.publicationStatus,
      designation:
        listing.publicationStatus === "public_teaser" ? "candidate" : undefined,
      publishedBy: null,
      lastPublishedAt: null,
      sponsorApprovedAt: null,
      sponsorApprovedBy: null,
      sponsorApprovalVersion: null,
      legalClearedAt: null,
      legalClearedBy: null,
      relatedPartyReviewedAt: null,
      relatedPartyReviewedBy: null,
      publicationHistory: appendHistory(listing.publicationHistory, {
        by: actorId,
        action: "invalidate_image_change",
        reason,
        at: at.toISOString(),
      }),
    },
  });
}
