import type { Metadata } from "next";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { prisma, toListing } from "@/lib/db";
import { fmtUsd, listings as sourceListings, type Listing } from "@/lib/data";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import {
  DisclosureChip,
  InstitutionalCard,
  NumberedProcess,
  QuietNotice,
  SectionHeading,
} from "@/components/public/PublicPrimitives";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DESCO Nexus — Structured African opportunities",
  description:
    "Review structured African investment opportunities with clear disclosure, sponsor-controlled diligence, and mandate-based screening.",
  alternates: { canonical: "/" },
};

const INVESTOR_PROCESS = [
  { title: "Review the public teaser", body: "Assess the thesis, capital requirement, sponsor, stage, risks and disclosure status." },
  { title: "Evaluate mandate fit", body: "Compare sector, geography, ticket size and instrument against saved investment criteria." },
  { title: "Request controlled access", body: "Ask the sponsor for access to restricted financial, technical and legal material." },
  { title: "Review confidential material", body: "Use the permission-controlled room and recorded activity history." },
  { title: "Meet the sponsor", body: "Request a meeting when the public and restricted information supports deeper engagement." },
  { title: "Progress independently", body: "Complete legal, financial, technical and commercial due diligence outside the platform." },
];

const TRUST_CONTROLS = [
  {
    title: "Structured project review",
    body: "DESCO reviews submissions for structure, completeness and internal consistency before publication. This is not independent investment verification.",
  },
  {
    title: "Clear disclosure status",
    body: "Public modules identify sponsor-provided, DESCO-reviewed, pending and restricted information.",
  },
  {
    title: "Permission-controlled rooms",
    body: "Confidential documents require an authenticated session and an explicit, revocable access grant.",
  },
  {
    title: "Recorded access activity",
    body: "Material access decisions, downloads and workflow changes can be logged for operational oversight.",
  },
  {
    title: "Sponsor-controlled confidentiality",
    body: "Sponsors decide which approved users can access restricted project information.",
  },
];

function FeaturedBrief({ listing }: { listing: Listing }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/14 bg-white text-ink shadow-2xl shadow-black/25">
      <div className="bg-gradient-to-br from-ink to-navy p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow text-gold">Featured opportunity briefing</p>
          <span className="text-xs font-semibold text-white/70">{listing.flag} {listing.country}</span>
        </div>
        <h2 className="mt-5 max-w-md font-display text-xl font-bold leading-snug text-white">{listing.title}</h2>
        <p className="mt-3 text-xs leading-5 text-white/65">{listing.sector} · Public teaser</p>
      </div>
      <div className="grid grid-cols-2 border-b border-ink/10">
        <div className="border-r border-ink/10 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Capital sought</p>
          <p className="mt-1 font-display text-2xl font-extrabold">{fmtUsd(listing.raiseUsd)}</p>
        </div>
        <div className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Project stage</p>
          <p className="mt-2 text-sm font-semibold">{listing.stage}</p>
        </div>
      </div>
      <div className="grid gap-3 p-4 text-xs sm:grid-cols-2">
        <div>
          <p className="text-slate">Sector</p>
          <p className="mt-1 font-semibold">{listing.sector}</p>
        </div>
        <div>
          <p className="text-slate">Location</p>
          <p className="mt-1 font-semibold">{listing.country}</p>
        </div>
        <div>
          <p className="text-slate">Disclosure</p>
          <div className="mt-1"><DisclosureChip tone="pending">Sponsor-provided</DisclosureChip></div>
        </div>
        <div>
          <p className="text-slate">Data room</p>
          <div className="mt-1"><DisclosureChip tone="restricted">Readiness not public</DisclosureChip></div>
        </div>
      </div>
      <div className="border-t border-ink/10 px-4 py-3">
        <Link href={`/project/${listing.id}`} className="inline-flex min-h-11 items-center text-xs font-bold text-ink hover:text-gold">
          Review opportunity →
        </Link>
      </div>
    </div>
  );
}

export default async function Home() {
  const user = await getSessionUser();
  const locale = await getLocale();
  const rows = await prisma.listing.findMany({
    include: { org: true, images: true },
    orderBy: { updatedAt: "desc" },
    take: 6,
  });
  const listings = rows.length > 0 ? rows.map(toListing) : sourceListings;
  const featured = listings.slice(0, 6);
  const totalCapital = featured.reduce((sum, listing) => sum + listing.raiseUsd, 0);

  return (
    <>
      {!user && (
        <>
          <section className="institutional-hero text-white">
            <div className="public-container grid gap-12 py-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,.92fr)] lg:items-center lg:py-20">
              <div>
                <p className="eyebrow text-gold">{t(locale, "home.platform")}</p>
                <h1 className="editorial-display mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
                  {t(locale, "home.heroTitle")}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 lg:text-lg">
                  {t(locale, "home.heroBody")}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/opportunities" className="button-primary">{t(locale, "home.review")}</Link>
                  <Link href="/submit-project" className="button-on-dark">{t(locale, "nav.submitProject")}</Link>
                </div>
                <Link href="/diligence" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-white/70 underline decoration-white/25 underline-offset-4 hover:text-gold">
                  {t(locale, "home.diligence")}
                </Link>
              </div>
              <FeaturedBrief listing={featured[0]} />
            </div>
          </section>

          <section className="bg-ivory py-12">
            <div className="public-container">
              <div className="grid gap-5 lg:grid-cols-2">
                <article className="group border-t-2 border-ink bg-white p-7 shadow-[0_8px_30px_rgb(13_21_28/0.045)]">
                  <p className="eyebrow text-teal">{t(locale, "nav.forInvestors")}</p>
                  <h2 className="editorial-heading mt-4 text-3xl text-ink">{t(locale, "home.investorTitle")}</h2>
                  <ul className="mt-5 space-y-2 text-sm text-slate">
                    <li>Review structured public opportunities</li>
                    <li>Match opportunities against your mandate</li>
                    <li>Request deeper diligence only when justified</li>
                  </ul>
                  <Link href="/investors" className="button-secondary mt-7">{t(locale, "home.investorCta")}</Link>
                </article>
                <article className="group border-t-2 border-gold bg-white p-7 shadow-[0_8px_30px_rgb(13_21_28/0.045)]">
                  <p className="eyebrow text-gold">{t(locale, "nav.forOwners")}</p>
                  <h2 className="editorial-heading mt-4 text-3xl text-ink">{t(locale, "home.sponsorTitle")}</h2>
                  <ul className="mt-5 space-y-2 text-sm text-slate">
                    <li>Prepare a sponsor-ready listing</li>
                    <li>Control confidential information access</li>
                    <li>Coordinate qualified investor engagement</li>
                  </ul>
                  <Link href="/sponsors" className="button-secondary mt-7">{t(locale, "home.sponsorCta")}</Link>
                </article>
              </div>
            </div>
          </section>
        </>
      )}

      {user && (
        <section className="bg-ivory">
          <div className="public-container py-9">
            <p className="eyebrow text-teal">{t(locale, "home.workspace")}</p>
            <h1 className="editorial-heading mt-3 text-3xl text-ink sm:text-4xl">
              {t(locale, "home.workspaceTitle")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              {t(locale, "home.workspaceBody")}
            </p>
          </div>
        </section>
      )}

      <section className="bg-white py-14 lg:py-18" id="opportunities">
        <div className="public-container">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow={t(locale, "home.opportunitiesEyebrow")}
              title={t(locale, "home.opportunitiesTitle")}
              body={t(locale, "home.opportunitiesBody")}
            />
            <div className="shrink-0 border-l border-gold pl-5">
              <p className="font-display text-2xl font-extrabold text-ink">{fmtUsd(totalCapital)}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate">Capital represented in displayed teasers</p>
              <p className="mt-1 text-[10px] text-slate">Sponsor-provided figures</p>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {featured.map((listing, index) => (
              <ProjectCard key={listing.id} listing={listing} index={index} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/opportunities" className="button-secondary">{t(locale, "home.opportunitiesCta")}</Link>
          </div>
        </div>
      </section>

      {!user && (
        <>
          <section className="bg-ivory py-14 lg:py-18" id="how-it-works">
            <div className="public-container">
              <SectionHeading
                eyebrow="Investor diligence pathway"
                title="A controlled path from screening to deeper review."
                body="DESCO Nexus supports screening, information exchange and engagement. Investors remain responsible for their own legal, financial, technical and commercial due diligence."
              />
              <div className="mt-9"><NumberedProcess items={INVESTOR_PROCESS} /></div>
              <div className="mt-7"><Link href="/diligence" className="button-secondary">Review the full diligence process</Link></div>
            </div>
          </section>

          <section className="bg-white py-14 lg:py-18" id="trust">
            <div className="public-container">
              <SectionHeading
                eyebrow="Trust and disclosure"
                title="Controls described by what they actually do."
                body="The platform distinguishes public, sponsor-provided, DESCO-reviewed, restricted and independently verified information. No status is an investment endorsement."
              />
              <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {TRUST_CONTROLS.map((control) => (
                  <InstitutionalCard key={control.title} title={control.title} body={control.body} />
                ))}
              </div>
              <div className="mt-8">
                <QuietNotice>
                  DESCO Nexus does not claim AML or KYC completion, SOC 2 certification, GDPR compliance, government approval, guaranteed returns or independent project verification unless expressly supported by approved evidence.
                </QuietNotice>
              </div>
              <Link href="/trust" className="button-secondary mt-7">Read the disclosure framework</Link>
            </div>
          </section>

          <section className="bg-ink py-14 text-white lg:py-18">
            <div className="public-container grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="eyebrow text-gold">Choose your next step</p>
                <h2 className="editorial-heading mt-4 max-w-3xl text-3xl text-white lg:text-4xl">
                  Review opportunities or prepare a project for institutional screening.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
                  Investor and sponsor journeys remain distinct through screening, access decisions and engagement.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/opportunities" className="button-primary">Review opportunities</Link>
                <Link href="/sponsors" className="button-on-dark">Prepare a project</Link>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
