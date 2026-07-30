import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import VerificationReviewRow from "./VerificationReviewRow";

export const dynamic = "force-dynamic";

export default async function AdminVerification() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  const listings = await prisma.listing.findMany({
    include: {
      org: true,
      sponsorConsents: true,
      legalClearances: true,
      relatedPartyReviews: true,
      _count: { select: { docs: true } },
    },
    orderBy: [{ verified: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight">Evidence review</h1>
      <p className="text-wgray text-sm mt-1 mb-6">
        {listings.filter((l) => !l.verified).length} listings without a recorded review out of {listings.length}.
        A recorded review means the administrator documented a scope-specific evidence check. There is no connected eKYC, registry or independent verification vendor.
      </p>

      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
          <p className="text-sm text-wgray">No listings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((l) => (
            <VerificationReviewRow
              key={l.id}
              listing={{
                id: l.id,
                title: l.title,
                orgName: l.org.name,
                verified: l.verified,
                verifiedBy: l.verifiedBy,
                verifiedAt: l.verifiedAt ? l.verifiedAt.toISOString() : null,
                verificationNote: l.verificationNote,
                governmentBacked: l.governmentBacked,
                govMechanism: l.govMechanism,
                publicationStatus: l.publicationStatus,
                publishedAt: l.publishedAt ? l.publishedAt.toISOString() : null,
                sourceCount: l._count.docs,
                hasRelatedPartyReview: Boolean(l.relatedPartyDisclosure.trim()),
                governanceReady: Boolean(
                  l.sponsorApprovedAt &&
                  l.legalClearedAt &&
                  l.relatedPartyReviewedAt &&
                  l.sponsorApprovalVersion === l.contentVersion &&
                  l.sponsorConsents.some((record) => record.contentVersion === l.contentVersion && !record.revokedAt) &&
                  l.legalClearances.some((record) => record.contentVersion === l.contentVersion && !record.revokedAt) &&
                  l.relatedPartyReviews.some((record) => record.contentVersion === l.contentVersion && !record.revokedAt),
                ),
                relatedParty: l.relatedParty,
                relatedPartyType: l.relatedPartyType,
                relatedPartyDisclosure: l.relatedPartyDisclosure,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
