import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import { STAGES } from "@/lib/deals";

export const dynamic = "force-dynamic";

const stages = STAGES;

const stageColor: Record<(typeof stages)[number], string> = {
  Discovered: "#7F8C8D",
  Saved: "#7F8C8D",
  Interested: "#B8953D",
  "Information Requested": "#0066CC",
  "Data-Room Requested": "#0066CC",
  "Data-Room Granted": "#0047AB",
  "Due Diligence": "#FF8C00",
  "IC Review": "#0047AB",
  "Term Sheet": "#B8953D",
  Negotiation: "#B8953D",
  Closed: "#00A550",
  "Passed or Withdrawn": "#C41E3A",
};

const daysIn = (since: Date) =>
  Math.max(0, Math.round((Date.now() - since.getTime()) / 86400_000));

export default async function Deals() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/deals");
  const locale = await getLocale();
  const deals = await prisma.deal.findMany({ orderBy: { createdAt: "asc" } });
  const totalM = deals.reduce(
    (a, d) => a + (parseInt(d.amount.replace(/[^0-9]/g, ""), 10) || 0),
    0
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="flex items-end justify-between mb-6 max-w-7xl">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight">
            {t(locale, "deals.title")}
          </h1>
          <p className="text-wgray text-sm mt-1">
            {deals.length} {t(locale, "deals.active")} · ${totalM}M {t(locale, "deals.inMotion")}
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className="font-display font-extrabold text-2xl text-gold">
              ${Math.round(totalM * 0.32)}M
            </div>
            <div className="text-[11px] text-wgray uppercase tracking-wider font-bold">{t(locale, "deals.forecast")}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 max-w-7xl">
        {stages.map((stage) => {
          const items = deals.filter((d) => d.stage === stage);
          return (
            <div key={stage} className="min-w-0">
              <div className="flex items-center gap-2 mb-3 px-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: stageColor[stage] }}
                />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {stage}
                </span>
                <span className="text-[11px] text-wgray ml-auto">{items.length}</span>
              </div>
              <div className="space-y-3">
                {items.map((d) => {
                  const days = daysIn(d.createdAt);
                  return (
                    <Link
                      key={d.id}
                      href={"/deals/" + d.id}
                      className="block bg-white rounded-xl p-4 shadow-[0_1px_3px_rgb(44_62_80/0.08)] hover:shadow-[0_4px_16px_rgb(44_62_80/0.10)] transition-shadow focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <div className="font-display font-bold text-sm leading-snug">
                        {d.flag} {d.title}
                        {d.kind !== "opportunity" && (
                          <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider text-gold">{d.kind.replace("-", " ")}</span>
                        )}
                      </div>
                      <div className="font-display font-extrabold text-lg mt-1.5">
                        {d.amount}
                      </div>
                      <div className="text-[11px] text-wgray mt-2">
                        → {d.nextStep}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="w-6 h-6 rounded-full bg-charcoal text-white text-[10px] font-bold flex items-center justify-center">
                          {d.owner}
                        </span>
                        <span
                          className={
                            "text-[10px] font-bold " +
                            (days > 30 ? "text-brandred" : "text-wgray")
                          }
                        >
                          {days}d {t(locale, "deals.inStage")}
                        </span>
                      </div>
                    </Link>
                  );
                })}
                {items.length === 0 && (
                  <div className="border-2 border-dashed border-charcoal/10 rounded-xl p-4 text-center text-[11px] text-wgray">
                    {t(locale, "deals.empty")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
