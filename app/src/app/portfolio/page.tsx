import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Portfolio() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/portfolio");

  const actedListingIds = (
    await prisma.matchAction.findMany({
      where: { userId: user.id, action: "interested" },
      select: { listingId: true },
      distinct: ["listingId"],
    })
  ).map((a) => a.listingId);

  const deals = await prisma.deal.findMany({
    where: { investorId: user.id, listingId: { in: actedListingIds } },
    include: { listing: { include: { org: true } } },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight">Monitored opportunities</h1>
      <p className="text-wgray text-sm mt-1 mb-6">
        Opportunities you have marked as relevant, with their current review
        stage. This view does not record an investment commitment or position.
      </p>

      {deals.length === 0 ? (
        <div className="bg-white  p-10 text-center ">
          <p className="text-sm text-wgray">
            No monitored opportunities yet. Mark an opportunity as interested
            to follow its review stage here.
          </p>
          <Link href="/" className="inline-block mt-4 text-sm font-display font-bold text-gold">
            Explore opportunities →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {deals.map((d) => {
            return (
              <Link
                key={d.id}
                href={"/project/" + d.listing.id}
                className="flex items-center justify-between bg-white  p-5    focus-visible:ring-2 focus-visible:ring-gold"
              >
                <div>
                  <div className="font-display font-bold">{d.flag} {d.title}</div>
                  <div className="text-xs text-wgray mt-0.5">{d.listing.org.name} · {d.stage}</div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-bold">Review stage</div>
                  <div className="text-wgray text-xs">{d.stage}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
