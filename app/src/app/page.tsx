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
      {!user && (
        <section className="bg-ink text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">
              A Desco Global platform
            </p>
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight max-w-2xl">
              Institutional investment opportunities in the Democratic Republic of Congo.
            </h2>
            <p className="text-white/70 text-sm lg:text-base mt-3 max-w-2xl leading-relaxed">
              DESCO Nexus connects investors — institutional funds, family
              offices, DFIs, and angel investors — with verified project
              sponsors across Desco Global&rsquo;s four pillars: agriculture,
              infrastructure, healthcare, and water. Investors discover and
              evaluate opportunities transparently; asset owners reach
              qualified capital.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/login" className="bg-gold text-ink font-display font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110">
                Sign in to discover opportunities
              </Link>
              <Link href="/pillars" className="border border-white/25 text-white font-display font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/10">
                Learn about our four pillars
              </Link>
            </div>
          </div>
        </section>
      )}
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
          {!user && (
            <Link href="/login" className="inline-flex mt-3 text-sm font-bold text-charcoal underline decoration-gold decoration-2 underline-offset-4 hover:text-gold">
              Sign in to see personalized matches and request data rooms
            </Link>
          )}
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

      <div className="flex items-center justify-between mb-3 text-xs text-wgray" aria-live="polite">
        <span>{listings.length} {listings.length === 1 ? "opportunity" : "opportunities"}</span>
        <span>Sorted by match score</span>
      </div>
      <div className="grid gap-5">
        {listings.map((l, i) => (
          <ProjectCard key={l.id} listing={l} index={i} />
        ))}
        {listings.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <h2 className="font-display font-bold text-lg">No opportunities match this filter</h2>
            <p className="text-sm text-wgray mt-2">Try another filter or use AI Search to describe your investment mandate.</p>
            <Link href="/search" className="inline-flex mt-4 bg-charcoal text-white font-display font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-ink">Open AI Search</Link>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
