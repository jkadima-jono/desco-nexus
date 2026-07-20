import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { fmtUsd } from "@/lib/data";
import CapitalAccountLedger from "./CapitalAccountLedger";

export const dynamic = "force-dynamic";

export default async function PositionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const { id } = await params;

  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      listing: { include: { org: true } },
      capitalCalls: { orderBy: { noticeDate: "asc" } },
      distributions: { orderBy: { paymentDate: "asc" } },
      updates: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!deal) notFound();

  const owns = await prisma.matchAction.findFirst({
    where: { userId: user.id, listingId: deal.listingId, action: "interested" },
  });
  if (!owns) notFound();

  const called = deal.capitalCalls.reduce((a, c) => a + c.amountUsd, 0);
  const distributed = deal.distributions.reduce((a, c) => a + c.amountUsd, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <Link href="/portfolio" className="text-xs font-bold text-wgray hover:text-charcoal">
        ← Portfolio
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-2 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight">
            {deal.flag} {deal.title}
          </h1>
          <p className="text-sm text-wgray mt-1">
            {deal.listing.org.name} · {deal.stage}
          </p>
        </div>
        <div className="text-right">
          <div className="font-display font-extrabold text-2xl">{fmtUsd(deal.listing.raiseUsd)}</div>
          <div className="text-[11px] text-wgray">committed</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <h2 className="font-display font-bold text-lg mb-4">Capital account</h2>
            <CapitalAccountLedger calls={deal.capitalCalls} distributions={deal.distributions} />
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <h2 className="font-display font-bold text-lg mb-4">Sponsor reporting</h2>
            {deal.updates.length === 0 ? (
              <p className="text-sm text-wgray">
                No sponsor updates yet for this position.
              </p>
            ) : (
              <div className="space-y-5">
                {deal.updates.map((u) => (
                  <div key={u.id} className="border-l-2 border-gold pl-4">
                    <div className="text-[11px] font-bold text-wgray uppercase tracking-wider">
                      {u.period} · {u.createdAt.toLocaleDateString()}
                    </div>
                    <div className="font-display font-bold text-sm mt-0.5">{u.title}</div>
                    <p className="text-sm text-charcoal/80 mt-1 leading-relaxed whitespace-pre-wrap">
                      {u.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)] text-sm space-y-3">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-wgray">
              Performance
            </h2>
            <div className="flex justify-between"><span className="text-wgray">Called</span><span className="font-bold">{fmtUsd(called)}</span></div>
            <div className="flex justify-between"><span className="text-wgray">Distributed</span><span className="font-bold text-gold">{fmtUsd(distributed)}</span></div>
            <div className="flex justify-between pt-2 border-t border-charcoal/10">
              <span className="text-wgray">Net position</span>
              <span className="font-bold">{fmtUsd(called - distributed)}</span>
            </div>
          </section>
          <section className="bg-mist rounded-2xl p-5 text-[11px] text-wgray leading-relaxed">
            Statement export (CSV) and standardized reporting templates are
            planned — see docs/10 §10 backlog item 8.
          </section>
        </div>
      </div>
    </div>
  );
}
