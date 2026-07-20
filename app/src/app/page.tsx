import { prisma, toListing } from "@/lib/db";
import { fmtUsd } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import ProofBar from "@/components/story/ProofBar";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

const FILTERS = ["for-you", "trending", "new", "gov", "esg", "close"] as const;

export default async function Discover({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const locale = await getLocale();
  const user = await getSessionUser();
  const requested = (await searchParams).filter;
  const activeFilter = FILTERS.includes(requested as (typeof FILTERS)[number]) ? requested! : "for-you";
  const rows = await prisma.listing.findMany({
    include: { org: true, images: true },
    orderBy: { matchScore: "desc" },
  });
  let listings = rows.map(toListing);
  if (activeFilter === "gov") listings = listings.filter((l) => l.governmentBacked);
  if (activeFilter === "esg") listings = listings.filter((l) => l.scores.esg >= 85);
  if (activeFilter === "new") listings = [...listings].reverse();
  if (activeFilter === "close") listings = listings.filter((l) => l.scores.readiness >= 85);
  const totalRaise = listings.reduce((a, l) => a + l.raiseUsd, 0);

  return (
    <>
      <ProofBar />
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-2">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight">
            {t(locale, "discover.title")}
          </h1>
          <p className="text-wgray text-sm mt-1">
            {user ? t(locale, "discover.subtitle") : "Explore current public opportunity teasers. Sign in for mandate-based ranking."}
          </p>
        </div>
        <div className="text-right">
          <div className="font-display font-extrabold text-2xl text-gold">
            {fmtUsd(totalRaise)}
          </div>
          <div className="text-[11px] text-wgray uppercase tracking-wider font-bold">
            {t(locale, "discover.live")}
          </div>
        </div>
      </div>

      <nav aria-label="Opportunity filters" className="flex gap-2 my-5 text-xs font-bold overflow-x-auto pb-1">
        {["chips.forYou", "chips.trending", "chips.new", "chips.gov", "chips.esg", "chips.close"].map(
          (key, i) => {
            const value = FILTERS[i];
            const selected = activeFilter === value;
            return <Link
              key={key}
              href={value === "for-you" ? "/" : `/?filter=${value}`}
              aria-current={selected ? "page" : undefined}
              className={"shrink-0 px-3 py-1.5 rounded-full focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 " + (selected ? "bg-charcoal text-white" : "bg-white text-charcoal shadow-[0_1px_3px_rgb(44_62_80/0.08)]")}
            >
              {t(locale, key)}
            </Link>;
          }
        )}
      </nav>

      <div className="grid gap-5">
        {listings.map((l, i) => (
          <ProjectCard key={l.id} listing={l} index={i} />
        ))}
      </div>
    </div>
    </>
  );
}
