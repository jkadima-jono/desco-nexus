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
    include: { org: true },
    orderBy: [{ verified: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight">Verification</h1>
      <p className="text-wgray text-sm mt-1 mb-6">
        {listings.filter((l) => !l.verified).length} unverified of {listings.length} listings.
        Verification here means: this reviewer checked the stated evidence — there is no
        connected eKYC/registry vendor in this build, so record what was actually reviewed.
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
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
