import { prisma, toListing } from "@/lib/db";
import { fmtUsd } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import ProofBar from "@/components/story/ProofBar";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import { getSessionUser } from "@/lib/auth";
import { computeMatchExplanation, parseJsonArray, type MandateCriteria } from "@/lib/matching";
import { PILLARS } from "@/lib/pillars";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DESCO Nexus — Connecting investment capital with structured opportunities",
  description:
    "DESCO Nexus helps investors discover investment-ready opportunities and helps project sponsors prepare, present, and manage investment processes across Desco Global's four pillars in the DRC.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DESCO Nexus — Connecting investment capital with structured opportunities",
    description: "A Desco Global platform for investors, project sponsors, and advisors.",
    url: "/",
    type: "website",
  },
};

const FILTERS = ["for-you", "trending", "new", "gov", "esg", "close"] as const;
const CONFIDENCE_RANK: Record<string, number> = { high: 3, medium: 2, low: 1, excluded: 0 };

const AUDIENCE_PATHS = [
  { title: "Investors", body: "Define a mandate, review transparent matches, and request data-room access when a project fits.", href: "/mandates", cta: "Create a mandate" },
  { title: "Project owners", body: "Present your project to qualified capital with a structured, verifiable listing.", href: "/submit-project", cta: "Submit a project" },
  { title: "Governments & agencies", body: "Promote verified regional projects and track investor engagement.", href: "/contact", cta: "Request a consultation" },
  { title: "Advisors", body: "Support clients through discovery, matching, and due diligence in one workspace.", href: "/contact", cta: "Get in touch" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Create and verify a profile", body: "Investors and sponsors register and go through identity and organization verification." },
  { step: "2", title: "Define a mandate or submit a project", body: "Investors set sector, geography, ticket size, and risk criteria. Sponsors submit project details for review." },
  { step: "3", title: "Review transparent matches", body: "Nexus compares mandate criteria against listings and shows exactly which criteria were met." },
  { step: "4", title: "Request information or data-room access", body: "Investors request further detail or permissioned access to project documents." },
  { step: "5", title: "Manage due diligence and transaction activity", body: "Track stage progress, messages, and documents through to close." },
];

const TRUST_POINTS = [
  { title: "Identity verification", body: "Individual users are identity-checked before gaining platform access." },
  { title: "Organization verification", body: "Sponsor and investor organizations are checked against registration records." },
  { title: "Project-information review", body: "Listings are reviewed for completeness and internal consistency before publication." },
  { title: "Permission-controlled data rooms", body: "Confidential documents require an authenticated session and explicit access." },
  { title: "Audit activity", body: "Material actions on a listing or deal are recorded with who, what, and when." },
  { title: "Human review", body: "A person reviews flagged content; verification is not fully automated." },
];

export default async function Discover({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const locale = await getLocale();
  const user = await getSessionUser();
  const requested = (await searchParams).filter;
  const activeFilter = FILTERS.includes(requested as (typeof FILTERS)[number]) ? requested! : "for-you";

  const activeMandate = user
    ? await prisma.standingMandate.findFirst({ where: { userId: user.id, active: true }, orderBy: { createdAt: "desc" } })
    : null;

  const rows = await prisma.listing.findMany({ include: { org: true, images: true }, orderBy: { matchScore: "desc" } });
  let listings = rows.map(toListing);

  if (activeMandate) {
    const criteria: MandateCriteria = {
      sectors: parseJsonArray(activeMandate.sectors),
      countries: parseJsonArray(activeMandate.countries),
      ticketMinUsd: activeMandate.ticketMinUsd,
      ticketMaxUsd: activeMandate.ticketMaxUsd,
      instruments: parseJsonArray(activeMandate.instruments),
      esgRequired: activeMandate.esgRequired,
      govSupportRequired: activeMandate.govSupportRequired,
      excludedSectors: parseJsonArray(activeMandate.excludedSectors),
      excludedCountries: parseJsonArray(activeMandate.excludedCountries),
    };
    const withRank = listings.map((l) => ({
      l,
      rank: CONFIDENCE_RANK[computeMatchExplanation(criteria, { sector: l.sector, country: l.country, raiseUsd: l.raiseUsd, instrument: l.instrument, governmentBacked: l.governmentBacked, scores: { esg: l.scores.esg } }).confidence],
    }));
    withRank.sort((a, b) => b.rank - a.rank || b.l.scores.match - a.l.scores.match);
    listings = withRank.map((r) => r.l);
  }

  if (activeFilter === "gov") listings = listings.filter((l) => l.governmentBacked);
  if (activeFilter === "esg") listings = listings.filter((l) => l.scores.esg >= 85);
  if (activeFilter === "new") listings = [...listings].reverse();
  if (activeFilter === "close") listings = listings.filter((l) => l.scores.readiness >= 85);
  const totalRaise = listings.reduce((a, l) => a + l.raiseUsd, 0);

  return (
    <>
      {!user && (
        <>
          {/* Hero */}
          <section className="bg-ink text-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
              <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-4">A Desco Global platform</p>
              <h1 className="font-display font-extrabold text-3xl lg:text-5xl tracking-tight max-w-3xl leading-[1.1]">
                Connecting investment capital with structured opportunities.
              </h1>
              <p className="text-white/70 text-base lg:text-lg mt-5 max-w-2xl leading-relaxed">
                DESCO Nexus helps investors discover investment-ready
                opportunities across Desco Global&rsquo;s four pillars in the
                DRC, and helps project sponsors prepare, present, and manage
                their investment process — from first listing to closing.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="#opportunities" className="bg-gold text-ink font-display font-bold text-sm px-5 py-3 rounded-xl hover:brightness-110">
                  Explore opportunities
                </Link>
                <Link href="/submit-project" className="border border-white/25 text-white font-display font-semibold text-sm px-5 py-3 rounded-xl hover:bg-white/10">
                  Submit a project
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-sm">
                <Link href="/mandates" className="text-white/70 underline decoration-white/30 hover:text-gold hover:decoration-gold">
                  Create an investor mandate
                </Link>
                <Link href="/contact" className="text-white/70 underline decoration-white/30 hover:text-gold hover:decoration-gold">
                  Request a DESCO consultation
                </Link>
              </div>
            </div>
          </section>

          {/* Audience paths */}
          <section className="py-14 lg:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display font-bold text-xl mb-6">Who Nexus is for</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {AUDIENCE_PATHS.map((a) => (
                  <div key={a.title} className="border border-charcoal/10 rounded-2xl p-5">
                    <h3 className="font-display font-bold text-sm">{a.title}</h3>
                    <p className="text-xs text-wgray mt-2 leading-relaxed">{a.body}</p>
                    <Link href={a.href} className="inline-flex mt-4 text-xs font-bold text-gold hover:underline">
                      {a.cta} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="bg-mist py-14 lg:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display font-bold text-xl mb-6">How it works</h2>
              <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {HOW_IT_WORKS.map((s) => (
                  <li key={s.step}>
                    <div className="w-8 h-8 rounded-full bg-charcoal text-white font-display font-bold text-sm flex items-center justify-center mb-3">
                      {s.step}
                    </div>
                    <h3 className="font-display font-bold text-sm">{s.title}</h3>
                    <p className="text-xs text-wgray mt-1.5 leading-relaxed">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Trust section */}
          <section id="trust" className="py-14 lg:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display font-bold text-xl mb-2">Trust &amp; verification</h2>
              <p className="text-sm text-wgray max-w-2xl mb-6">
                Verification reduces specific risks — it does not guarantee investment
                performance. Read the full <Link href="/legal#verification" className="text-gold font-semibold hover:underline">verification methodology</Link>.
              </p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {TRUST_POINTS.map((p) => (
                  <div key={p.title} className="border-l-2 border-gold pl-4">
                    <h3 className="font-display font-bold text-sm">{p.title}</h3>
                    <p className="text-xs text-wgray mt-1.5 leading-relaxed">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <ProofBar />

      <div id="opportunities" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-2">
          <div>
            <h2 className="font-display font-extrabold text-3xl tracking-tight">
              {t(locale, "discover.title")}
            </h2>
            <p className="text-wgray text-sm mt-1">
              {user
                ? (activeMandate ? "Ranked against your saved mandate." : t(locale, "discover.subtitle"))
                : "Explore current public opportunity teasers. Sign in for mandate-based ranking."}
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

        <nav aria-label="Opportunity filters" className="flex items-center gap-2 my-5 text-xs font-bold overflow-x-auto pb-1">
          {["for-you-label", "chips.trending", "chips.new", "chips.gov", "chips.esg", "chips.close"].map(
            (key, i) => {
              const value = FILTERS[i];
              const selected = activeFilter === value;
              const label = key === "for-you-label" ? (activeMandate ? t(locale, "chips.recommended") : t(locale, "chips.allOpportunities")) : t(locale, key);
              return <Link
                key={key}
                href={value === "for-you" ? "/" : `/?filter=${value}`}
                aria-current={selected ? "page" : undefined}
                className={"shrink-0 px-3 py-1.5 rounded-full focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 " + (selected ? "bg-charcoal text-white" : "bg-white text-charcoal border border-charcoal/10")}
              >
                {label}
              </Link>;
            }
          )}
          {activeFilter !== "for-you" && (
            <Link href="/" className="shrink-0 px-3 py-1.5 rounded-full text-wgray hover:text-charcoal">
              Reset filters ×
            </Link>
          )}
        </nav>

        <div className="flex items-center justify-between mb-3 text-xs text-wgray" aria-live="polite">
          <span>{listings.length} {listings.length === 1 ? "opportunity" : "opportunities"}</span>
          <span>{activeMandate ? "Sorted by mandate fit" : "Sorted by match score"}</span>
        </div>
        <div className="grid gap-5">
          {listings.map((l, i) => (
            <ProjectCard key={l.id} listing={l} index={i} showMatchScore={!!activeMandate} />
          ))}
          {listings.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center border border-charcoal/10">
              <h3 className="font-display font-bold text-lg">No opportunities match this filter</h3>
              <p className="text-sm text-wgray mt-2">Try another filter or use AI Search to describe your investment mandate.</p>
              <Link href="/search" className="inline-flex mt-4 bg-charcoal text-white font-display font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-ink">Open AI Search</Link>
            </div>
          )}
        </div>
      </div>

      {!user && (
        <>
          {/* Pillars teaser */}
          <section className="bg-mist py-14 lg:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display font-bold text-xl mb-6">Desco Global&rsquo;s four pillars</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {PILLARS.map((p) => (
                  <Link key={p.slug} href={"/pillars/" + p.slug} className="bg-white rounded-2xl p-5 border border-charcoal/10 hover:border-gold/50 transition-colors">
                    <div className="w-2 h-2 rounded-full mb-3" style={{ background: p.color }} />
                    <h3 className="font-display font-bold text-sm">{p.name}</h3>
                    <p className="text-xs text-wgray mt-1.5 leading-relaxed line-clamp-3">{p.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Conversion section */}
          <section className="bg-ink text-white py-14 lg:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 sm:grid-cols-3 text-center">
              <div>
                <h3 className="font-display font-bold text-sm mb-2">Investors</h3>
                <p className="text-xs text-white/60 mb-4">Set your criteria once, get evidence-based matches.</p>
                <Link href="/mandates" className="inline-flex bg-gold text-ink font-display font-bold text-sm px-4 py-2.5 rounded-xl hover:brightness-110">Create a mandate</Link>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm mb-2">Project owners</h3>
                <p className="text-xs text-white/60 mb-4">Present your project to qualified capital.</p>
                <Link href="/submit-project" className="inline-flex border border-white/25 text-white font-display font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/10">Submit a project</Link>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm mb-2">Institutions</h3>
                <p className="text-xs text-white/60 mb-4">Multi-seat access, workflow approvals, reporting.</p>
                <Link href="/contact" className="inline-flex border border-white/25 text-white font-display font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/10">Discuss enterprise access</Link>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
