import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { projectHref } from "@/lib/project-slugs";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageDeal } from "@/lib/authz";
import { STAGE_PROBABILITY, STAGE_REQUIREMENTS, amountUsd, type Stage } from "@/lib/deals";
import StageControl from "./StageControl";
import DealMeta from "./DealMeta";

export const dynamic = "force-dynamic";

export default async function DealWorkspace({
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
      parent: true,
      tranches: true,
    },
  });
  if (!deal) notFound();

  // A listing-level action is not authorization to another investor's deal.
  if (!canManageDeal(user, deal)) {
    const authorized =
      (user.role === "investor" && deal.investorId === user.id) ||
      (user.role === "advisor" &&
        !!(await prisma.advisorDealAssignment.findFirst({
          where: { advisorId: user.id, dealId: deal.id, revokedAt: null },
          select: { id: true },
        })));
    if (!authorized) notFound();
  }

  const history = JSON.parse(deal.history || "[]") as {
    from: string; to: string; by: string; reason: string | null; at: string;
  }[];
  const probability = deal.probability ?? STAGE_PROBABILITY[deal.stage as Stage] ?? 10;
  const weighted = Math.round((amountUsd(deal.amount) * probability) / 1e6 / 100);
  const related = deal.parent
    ? [
        ...(deal.parent.investorId === deal.investorId ? [deal.parent] : []),
        ...(await prisma.deal.findMany({
          where: { parentId: deal.parentId!, id: { not: deal.id }, investorId: deal.investorId },
        })),
      ]
    : deal.tranches.filter((relatedDeal) => relatedDeal.investorId === deal.investorId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <Link href="/deals" className="text-xs font-bold text-wgray hover:text-charcoal">← Pipeline</Link>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-2 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight">
            {deal.flag} {deal.title}
          </h1>
          <p className="text-sm text-wgray mt-1">
            {deal.kind !== "opportunity" && (
              <span className="mr-2 px-2 py-0.5 rounded-full bg-gold-soft text-gold text-[11px] font-bold uppercase tracking-wider">{deal.kind}</span>
            )}
            <Link href={projectHref(deal.listingId)} className="text-gold font-bold hover:underline">
              {deal.listing.title}
            </Link>{" "}
            · {deal.listing.org.name}
          </p>
        </div>
        <div className="text-right">
          <div className="font-display font-extrabold text-3xl">{deal.amount}</div>
          <div className="text-[11px] text-wgray">
            {probability}% probability · weighted ${weighted}M
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <h2 className="font-display font-bold text-lg mb-4">Stage</h2>
            <StageControl dealId={deal.id} current={deal.stage} />
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <h2 className="font-display font-bold text-lg mb-3">Decision history</h2>
            {history.length === 0 ? (
              <p className="text-sm text-wgray">No stage changes recorded yet. Every transition is logged here with actor and reason.</p>
            ) : (
              <ol className="space-y-2 text-sm">
                {[...history].reverse().map((h, i) => (
                  <li key={i} className="flex flex-wrap gap-x-2 border-l-2 border-gold pl-3">
                    <span className="font-bold">{h.from} → {h.to}</span>
                    <span className="text-wgray">by {h.by} · {new Date(h.at).toLocaleDateString()}</span>
                    {h.reason && <span className="w-full text-wgray">Reason: {h.reason}</span>}
                  </li>
                ))}
              </ol>
            )}
          </section>

          {related.length > 0 && (
            <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
              <h2 className="font-display font-bold text-lg mb-3">Related tranches & workstreams</h2>
              <div className="space-y-2">
                {related.map((r) => (
                  <Link key={r.id} href={"/deals/" + r.id} className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-mist text-sm">
                    <span>
                      <span className="font-bold">{r.title}</span>
                      <span className="ml-2 text-[11px] text-wgray uppercase">{r.kind}</span>
                    </span>
                    <span className="text-wgray">{r.amount} · {r.stage}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)] text-sm space-y-2">
            <h2 className="font-display font-bold text-lg mb-2">Details</h2>
            {[
              ["Owner", deal.owner],
              ["Next action", deal.nextStep],
              ["Opened", deal.createdAt.toLocaleDateString()],
              ["Counterparty", deal.listing.org.name],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <span className="text-wgray">{k}</span>
                <span className="font-semibold text-right">{v}</span>
              </div>
            ))}
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <h2 className="font-display font-bold text-lg mb-3">Due date &amp; decision notes</h2>
            <DealMeta
              dealId={deal.id}
              dueDate={deal.dueDate ? deal.dueDate.toISOString() : null}
              notes={JSON.parse(deal.decisionNotes || "[]")}
            />
          </section>

          <section className="bg-gold-soft border-l-4 border-gold rounded-2xl p-5 text-xs leading-relaxed">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gold mb-1.5">Forecast method</div>
            Weighted value = amount × stage probability. Stage probabilities
            climb through Discovered (2%) → Saved → Interested → Information
            Requested → Data-Room Requested/Granted → Due Diligence → IC
            Review → Term Sheet → Negotiation (90%) → Closed (100%).
            Deal-specific overrides require a recorded reason.
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)] text-xs leading-relaxed">
            <h2 className="font-display font-bold text-sm mb-2">Stage entry requirements</h2>
            {Object.entries(STAGE_REQUIREMENTS).map(([s, r]) => (
              <p key={s} className={s === deal.stage ? "font-bold" : "text-wgray"}>
                <span className="uppercase text-[10px] tracking-wider">{s}:</span> {r}
              </p>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
