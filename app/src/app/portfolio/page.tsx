import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { fmtUsd } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Portfolio() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const actedListingIds = (
    await prisma.matchAction.findMany({
      where: { userId: user.id, action: "interested" },
      select: { listingId: true },
      distinct: ["listingId"],
    })
  ).map((a) => a.listingId);

  const deals = await prisma.deal.findMany({
    where: { listingId: { in: actedListingIds } },
    include: { listing: { include: { org: true } }, capitalCalls: true, distributions: true },
  });

  const totals = deals.reduce(
    (acc, d) => {
      const called = d.capitalCalls.reduce((a, c) => a + c.amountUsd, 0);
      const distributed = d.distributions.reduce((a, c) => a + c.amountUsd, 0);
      acc.committed += d.listing.raiseUsd;
      acc.called += called;
      acc.distributed += distributed;
      return acc;
    },
    { committed: 0, called: 0, distributed: 0 }
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight">Portfolio</h1>
      <p className="text-wgray text-sm mt-1 mb-6">
        Your positions across Compass — capital calls, distributions, and
        sponsor reporting in one place.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl">
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
          <div className="text-[11px] font-bold text-wgray uppercase tracking-wider">Committed</div>
          <div className="font-display font-extrabold text-xl mt-1">{fmtUsd(totals.committed)}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
          <div className="text-[11px] font-bold text-wgray uppercase tracking-wider">Called</div>
          <div className="font-display font-extrabold text-xl mt-1">{fmtUsd(totals.called)}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
          <div className="text-[11px] font-bold text-wgray uppercase tracking-wider">Distributed</div>
          <div className="font-display font-extrabold text-xl mt-1 text-gold">{fmtUsd(totals.distributed)}</div>
        </div>
      </div>

      {deals.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
          <p className="text-sm text-wgray">
            No positions yet. Positions appear here once a data-room request
            converts to a closed commitment.
          </p>
          <Link href="/" className="inline-block mt-4 text-sm font-display font-bold text-gold">
            Explore opportunities →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {deals.map((d) => {
            const called = d.capitalCalls.reduce((a, c) => a + c.amountUsd, 0);
            const distributed = d.distributions.reduce((a, c) => a + c.amountUsd, 0);
            return (
              <Link
                key={d.id}
                href={"/portfolio/" + d.id}
                className="flex items-center justify-between bg-white rounded-xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)] hover:shadow-[0_4px_16px_rgb(44_62_80/0.10)] transition-shadow focus-visible:ring-2 focus-visible:ring-gold"
              >
                <div>
                  <div className="font-display font-bold">{d.flag} {d.title}</div>
                  <div className="text-xs text-wgray mt-0.5">{d.listing.org.name} · {d.stage}</div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-bold">{fmtUsd(called)} called</div>
                  <div className="text-wgray text-xs">{fmtUsd(distributed)} distributed</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
