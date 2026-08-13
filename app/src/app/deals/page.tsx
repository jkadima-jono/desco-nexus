import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import { STAGES } from "@/lib/deals";
import type { Prisma, User } from "@prisma/client";

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

// This pipeline board previously showed every sponsor's deals to any
// signed-in user regardless of role or org — a real cross-org data leak
// (owner names, next-step notes, amounts, due dates). Scope what each
// role can see:
//   admin   — everything (correct today, unchanged)
//   owner   — only deals for listings their own org owns
//   investor — only their own per-investor deal records
//   advisor — only deals assigned explicitly to them; no assignment means
//     no access. Listing-level engagement is never a deal authorization.
async function visibleDealsWhere(user: User): Promise<Prisma.DealWhereInput> {
  if (user.role === "admin") return {};
  if (user.role === "owner") {
    if (!user.orgId) return { id: "__none__" };
    return { listing: { orgId: user.orgId } };
  }
  if (user.role === "investor") return { investorId: user.id };
  if (user.role === "advisor") {
    return { advisorAssignments: { some: { advisorId: user.id, revokedAt: null } } };
  }
  return { id: "__none__" };
}

export default async function Deals() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/deals");
  const locale = await getLocale();
  const deals = await prisma.deal.findMany({ where: await visibleDealsWhere(user), orderBy: { createdAt: "asc" } });
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="flex items-end justify-between mb-6 max-w-7xl">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight">
            {t(locale, "deals.title")}
          </h1>
          <p className="text-wgray text-sm mt-1">
            {deals.length} {t(locale, "deals.active")} {t(locale, "deals.inMotion")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 max-w-7xl">
        {stages.map((stage) => {
          const items = deals.filter((d) => d.stage === stage);
          return (
            <div key={stage} className="min-w-0">
              <div className="flex items-center gap-2 mb-3 px-1">
                <span
                  className="w-2.5 h-2.5"
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
                      className="block bg-white  p-4    focus-visible:ring-2 focus-visible:ring-gold"
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
                        <span className="w-6 h-6  bg-charcoal text-white text-[10px] font-bold flex items-center justify-center">
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
                  <div className="border-2 border-dashed border-charcoal/10  p-4 text-center text-[11px] text-wgray">
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
