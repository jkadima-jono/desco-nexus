import type { Metadata } from "next";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { prisma, toListing } from "@/lib/db";
import { materialFactPresentation, type Listing } from "@/lib/data";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import { getMarketingCopy, getMarketingMetadata, type HomeMarketingCopy } from "@/lib/translations/marketing";
import {
  DisclosureChip,
  InstitutionalCard,
  NumberedProcess,
  QuietNotice,
  SectionHeading,
} from "@/components/public/PublicPrimitives";
import { projectHref } from "@/lib/project-slugs";
import { orderPublicOpportunities, publicListingWhere } from "@/lib/public-listings";
import { localizeListing } from "@/lib/translations/listing-content";
import { catalogueReviewNote, materialFactCopy } from "@/lib/translations/investment-ui";
import { getInvestmentEvidence } from "@/lib/investment-evidence";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = getMarketingMetadata(await getLocale(), "home");
  return { ...metadata, alternates: { canonical: "/" } };
}

function FeaturedBrief({ listing, copy, locale }: { listing: Listing; copy: HomeMarketingCopy; locale: Awaited<ReturnType<typeof getLocale>> }) {
  const evidence = getInvestmentEvidence(listing);
  const fact = materialFactPresentation(listing, evidence.provenance.sourceDate);
  const factCopy = materialFactCopy(locale, fact.kind, fact.sourceDate);
  return (
    <div className="overflow-hidden rounded-xl border border-white/14 bg-white text-ink shadow-2xl shadow-black/25">
      <div className="bg-gradient-to-br from-ink to-navy p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow text-gold">{copy.featured}</p>
          <span className="text-xs font-semibold text-white/70">{listing.flag} {listing.country}</span>
        </div>
        <h2 className="mt-5 max-w-md font-display text-xl font-bold leading-snug text-white">{listing.title}</h2>
        <p className="mt-3 text-xs leading-5 text-white/65">{listing.sector} · {copy.publicTeaser}</p>
      </div>
      <div className="grid grid-cols-2 border-b border-ink/10">
        <div className="border-r border-ink/10 p-4">
          <p className="text-xs font-bold text-slate">{factCopy.label}</p>
          <p className={fact.kind === "not_disclosed" ? "mt-2 text-sm font-semibold text-slate" : "mt-1 break-words font-display text-2xl font-extrabold"}>{fact.value}</p>
          {fact.kind === "estimated_cost" && <p className="mt-1 text-xs text-wgray">{factCopy.capitalGap}</p>}
        </div>
        <div className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate">{copy.projectStage}</p>
          <p className="mt-2 text-sm font-semibold">{listing.stage}</p>
        </div>
      </div>
      <div className="grid gap-3 p-4 text-xs sm:grid-cols-2">
        <div>
          <p className="text-slate">{copy.sector}</p>
          <p className="mt-1 font-semibold">{listing.sector}</p>
        </div>
        <div>
          <p className="text-slate">{copy.location}</p>
          <p className="mt-1 font-semibold">{listing.country}</p>
        </div>
        <div>
          <p className="text-slate">{copy.disclosure}</p>
          <div className="mt-1"><DisclosureChip tone="pending">{copy.sponsorProvided}</DisclosureChip></div>
        </div>
        <div>
          <p className="text-slate">{copy.dataRoom}</p>
          <div className="mt-1"><DisclosureChip tone="restricted">{copy.readinessNotPublic}</DisclosureChip></div>
        </div>
      </div>
      <div className="border-t border-ink/10 px-4 py-3">
        <Link href={projectHref(listing.id)} className="inline-flex min-h-11 items-center text-sm font-bold text-ink hover:text-gold">
          {copy.reviewOpportunity} →
        </Link>
      </div>
    </div>
  );
}

export default async function Home() {
  const user = await getSessionUser();
  const locale = await getLocale();
  const copy = getMarketingCopy(locale, "home");
  const rows = await prisma.listing.findMany({
    where: publicListingWhere,
    include: { org: true, images: true },
    orderBy: { updatedAt: "desc" },
    take: 6,
  });
  const listings = rows.map(toListing);
  const featured = orderPublicOpportunities(listings).slice(0, 4);
  const localizedFeatured = featured.map((listing) => localizeListing(listing, locale));
  const reviewStatuses = new Set(featured.map((listing) => listing.verified));
  const hasDifferentiatingReviewStatus = reviewStatuses.size > 1;

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
                  <Link href="/contact?topic=project-submission" className="button-on-dark">{t(locale, "nav.submitProject")}</Link>
                </div>
                <Link href="/diligence" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-white/70 underline decoration-white/25 underline-offset-4 hover:text-gold">
                  {t(locale, "home.diligence")}
                </Link>
              </div>
              {localizedFeatured[0] && <FeaturedBrief listing={localizedFeatured[0]} copy={copy} locale={locale} />}
            </div>
          </section>

          <section className="bg-ivory py-12">
            <div className="public-container">
              <div className="grid gap-5 lg:grid-cols-2">
                <article className="group border-t-2 border-ink bg-white p-7 shadow-[0_8px_30px_rgb(13_21_28/0.045)]">
                  <p className="eyebrow text-teal">{t(locale, "nav.forInvestors")}</p>
                  <h2 className="editorial-heading mt-4 text-3xl text-ink">{t(locale, "home.investorTitle")}</h2>
                  <ul className="mt-5 space-y-2 text-sm text-slate">
                    {copy.investorBenefits.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <Link href="/investors" className="button-secondary mt-7">{t(locale, "home.investorCta")}</Link>
                </article>
                <article className="group border-t-2 border-gold bg-white p-7 shadow-[0_8px_30px_rgb(13_21_28/0.045)]">
                  <p className="eyebrow text-gold">{t(locale, "nav.forOwners")}</p>
                  <h2 className="editorial-heading mt-4 text-3xl text-ink">{t(locale, "home.sponsorTitle")}</h2>
                  <ul className="mt-5 space-y-2 text-sm text-slate">
                    {copy.sponsorBenefits.map((item) => <li key={item}>{item}</li>)}
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
          <div>
            <SectionHeading
              eyebrow={t(locale, "home.opportunitiesEyebrow")}
              title={t(locale, "home.opportunitiesTitle")}
              body={t(locale, "home.opportunitiesBody")}
            />
          </div>

          {!hasDifferentiatingReviewStatus && featured.length > 0 && (
            <div className="mt-6 max-w-4xl">
              <QuietNotice>{catalogueReviewNote(locale, featured[0].verified)}</QuietNotice>
            </div>
          )}

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {localizedFeatured.slice(user ? 0 : 1).map((listing, index) => (
              <ProjectCard key={listing.id} listing={listing} index={index} locale={locale} showReviewStatus={hasDifferentiatingReviewStatus} />
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
                eyebrow={copy.processEyebrow}
                title={copy.processTitle}
                body={copy.processBody}
              />
              <div className="mt-9"><NumberedProcess items={copy.process} /></div>
              <div className="mt-7"><Link href="/diligence" className="button-secondary">{copy.processCta}</Link></div>
            </div>
          </section>

          <section className="bg-white py-14 lg:py-18" id="trust">
            <div className="public-container">
              <SectionHeading
                eyebrow={copy.trustEyebrow}
                title={copy.trustTitle}
                body={copy.trustBody}
              />
              <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {copy.controls.map((control) => (
                  <InstitutionalCard key={control.title} title={control.title} body={control.body} />
                ))}
              </div>
              <div className="mt-8">
                <QuietNotice>
                  {copy.trustNotice}
                </QuietNotice>
              </div>
              <Link href="/trust" className="button-secondary mt-7">{copy.trustCta}</Link>
            </div>
          </section>

          <section className="bg-ink py-14 text-white lg:py-18">
            <div className="public-container grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="eyebrow text-gold">{copy.nextEyebrow}</p>
                <h2 className="editorial-heading mt-4 max-w-3xl text-3xl text-white lg:text-4xl">
                  {copy.nextTitle}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
                  {copy.nextBody}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/opportunities" className="button-primary">{copy.reviewCta}</Link>
                <Link href="/sponsors" className="button-on-dark">{copy.prepareCta}</Link>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
