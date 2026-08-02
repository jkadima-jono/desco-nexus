import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const STAGE_LABEL: Record<string, string> = {
  interested: "Committed interest",
  saved: "Saved",
  pass: "Passed",
  follow: "Following",
};

export default async function SponsorInvestors() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/sponsor/investors");
  if (user.role !== "owner" && user.role !== "admin") redirect("/");

  const listings = await prisma.listing.findMany({
    where: user.role === "admin" ? {} : { orgId: user.orgId ?? "__none__" },
    select: { id: true, title: true },
  });
  const listingIds = listings.map((l) => l.id);
  const titleById = Object.fromEntries(listings.map((l) => [l.id, l.title]));

  const actions = await prisma.matchAction.findMany({
    where: { listingId: { in: listingIds } },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { fullName: true, email: true } } },
  });

  const seen = new Set<string>();
  const rows = actions.filter((a) => {
    const key = a.userId + ":" + a.listingId;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight">Investor Engagement</h1>
      <p className="text-wgray text-sm mt-1 mb-6">
        Everyone who has interacted with your listings, most recent first.
      </p>

      {rows.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
          <p className="text-sm text-wgray">
            No investor engagement recorded yet — this fills in as investors
            view, save, or express interest in your listings.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgb(44_62_80/0.08)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-mist text-[11px] text-wgray uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3 font-bold">Investor</th>
                <th className="text-left px-5 py-3 font-bold">Listing</th>
                <th className="text-left px-5 py-3 font-bold">Stage</th>
                <th className="text-left px-5 py-3 font-bold">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.userId + a.listingId + a.createdAt.toISOString()} className="border-t border-charcoal/10">
                  <td className="px-5 py-3 font-semibold">{a.user.fullName}</td>
                  <td className="px-5 py-3 text-wgray">{titleById[a.listingId] ?? "—"}</td>
                  <td className="px-5 py-3">{STAGE_LABEL[a.action] ?? a.action}</td>
                  <td className="px-5 py-3 text-wgray">{a.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
