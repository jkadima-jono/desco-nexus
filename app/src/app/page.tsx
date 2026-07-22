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
  title: "DESCO Nexus — Connecting investment capital with structured project opportunities",
  description:
    "DESCO Nexus helps investors review structured project opportunities and helps sponsors prepare information, manage access, and coordinate due diligence across Desco Global's four pillars in the DRC.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DESCO Nexus — Connecting investment capital with structured project opportunities",
    description: "A Desco Global platform for investors, project sponsors, and advisors.",
    url: "/",
    type: "website",
  },
};

const FILTERS = ["for-you", "trending", "new", "gov", "esg", "close"] as const;
const CONFIDENCE_RANK: Record<string, number> = { high: 3, medium: 2, low: 1, excluded: 0 };

// Final role-specific CTA (section 7). Governments/advisors route to
// /contact since neither has a dedicated workflow yet — that's a real,
// disclosed limitation, not hidden behind a generic "Get in touch".
const AUDIENCE_PATHS = [
  { title: "Investors", body: "Define a mandate, review transparent matches, and request data-room access when a project fits.", href: "/mandates", cta: "Create an investor mandate" },
  { title: "Project owners", body: "Present your project with a structured listing sponsors and DESCO can both review.", href: "/submit-project", cta: "Submit a project" },
  { title: "Governments & agencies", body: "Discuss listing regional projects and reviewing investor engagement with DESCO directly.", href: "/contact", cta: "Request a DESCO consultation" },
  { title: "Advisors", body: "Discuss supporting clients through discovery, matching, and due diligence with DESCO directly.", href: "/contact", cta: "Contact DESCO" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Create a profile", body: "Investors and sponsors register. This demonstration uses fictional demo accounts, not verified identities — see Trust controls below." },
  { step: "2", title: "Define a mandate or submit a project", body: "Investors set sector, geography, ticket size, and risk criteria. Sponsors submit project details for DESCO review." },
  { step: "3", title: "Review transparent matches", body: "Nexus compares mandate criteria against listings with a deterministic rule set and shows exactly which criteria were met." },
  { step: "4", title: "Request information or data-room access", body: "Investors request further detail or permissioned access to project documents; sponsors grant or revoke access." },
  { step: "5", title: "Track the process to a decision", body: "Stage progress, messages, and documents are tracked through to an investment decision. Executing the transaction itself happens off-platform." },
];

// Every claim here is checked against what the code actually does — see
// /legal#verification for the full methodology and each control's status.
const TRUST_POINTS = [
  { title: "Identity & organization checks", status: "Planned for production", body: "Production access is intended to include identity and organization checks. This demonstration uses fictional accounts and does not perform identity verification." },
  { title: "Project-information review", status: "Active in this demonstration", body: "A DESCO admin reviews submitted project information for completeness before a listing is published." },
  { title: "Listing verification badge", status: "Active in this demonstration", body: "A \"Verified\" badge means a DESCO admin recorded reviewing specific stated evidence — never an independent third-party check, since none is connected." },
  { title: "Permission-controlled data rooms", status: "Active in this demonstration", body: "Confidential documents require an authenticated session and an explicit, revocable grant from the sponsor." },
  { title: "Audit activity", status: "Active in this demonstration", body: "Stage changes, verification decisions, and document downloads are logged with who, what, and when." },
  { title: "AML / KYC, securities-law, SOC 2, GDPR", status: "Requires legal, compliance & external providers", body: "This platform does not claim compliance with any of these. That work requires DESCO's legal/compliance teams and, in most cases, a third-party provider Nexus does not yet integrate." },
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
        /* 1. Hero — two primary journeys (Explore opportunities, Submit a
           project), two secondary (Create a mandate, Request a consultation). */
        <section className="bg-ink text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
            <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-4">A Desco Global platform</p>
            <h1 className="font-display font-extrabold text-3xl lg:text-5xl tracking-tight max-w-3xl leading-[1.1]">
              Connecting investment capital with structured project opportunities.
            </h1>
            <p className="text-white/70 text-base lg:text-lg mt-5 max-w-2xl leading-relaxed">
              DESCO Nexus helps investors review structured project opportunities
              across Desco Global&rsquo;s four pillars in the DRC, and helps
              sponsors prepare information, manage access, and coordinate due
              diligence.
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
            <p className="text-white/40 text-xs mt-6 max-w-2xl leading-relaxed">
              This is a demonstration environment. Accounts and transactions are
              fictional. Projects may reference real DESCO initiatives, but
              nothing shown is automatically a public securities offer.
            </p>
          </div>
        </section>
      )}

      {/* 2. Platform-status and evidence strip — real counts, no vanity metrics. */}
      <ProofBar />

      {/* 3. Selected opportunities */}
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
          {/* 4. How the process works */}
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

          {/* 5. DESCO's role and operating pillars */}
          <section className="py-14 lg:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display font-bold text-xl mb-2">Desco Global&rsquo;s four pillars</h2>
              <p className="text-sm text-wgray max-w-2xl mb-6">
                Desco Global is the operating group behind these pillars; DESCO Nexus is
                its investment platform. Sponsors listed on Nexus operate under or
                alongside these pillars, not as DESCO Global itself.
              </p>
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

          {/* 6. Trust controls and their limitations */}
          <section id="trust" className="bg-mist py-14 lg:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display font-bold text-xl mb-2">Trust controls</h2>
              <p className="text-sm text-wgray max-w-2xl mb-6">
                Each control below is labeled with what it actually does today, not what
                a production version might eventually do. None of this guarantees
                investment performance. Read the full <Link href="/legal#verification" className="text-gold font-semibold hover:underline">verification methodology</Link>.
              </p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {TRUST_POINTS.map((p) => (
                  <div key={p.title} className="border-l-2 border-gold pl-4">
                    <h3 className="font-display font-bold text-sm">{p.title}</h3>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gold mt-1">{p.status}</div>
                    <p className="text-xs text-wgray mt-1.5 leading-relaxed">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 7. Final role-specific action */}
          <section className="bg-ink text-white py-14 lg:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display font-bold text-xl mb-6">Take the next step</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {AUDIENCE_PATHS.map((a) => (
                  <div key={a.title}>
                    <h3 className="font-display font-bold text-sm mb-2">{a.title}</h3>
                    <p className="text-xs text-white/60 mb-4 leading-relaxed">{a.body}</p>
                    <Link href={a.href} className="inline-flex text-sm font-bold text-gold hover:underline">
                      {a.cta} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
