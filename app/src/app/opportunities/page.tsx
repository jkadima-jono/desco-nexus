import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, QuietNotice, SectionHeading } from "@/components/public/PublicPrimitives";
import { prisma, toListing } from "@/lib/db";
import { getLocale } from "@/lib/i18n-server";
import { getPublicHero } from "@/lib/public-copy";
import ComparisonGrid from "./ComparisonGrid";
import { catalogueReviewNote, instrumentCategoryCopy, investmentUi } from "@/lib/translations/investment-ui";
import { localizeListing } from "@/lib/translations/listing-content";
import { publicListingWhere } from "@/lib/public-listings";
import { t } from "@/lib/i18n";
import { publicPageMetadata } from "@/lib/metadata";
import { openSignupConfig } from "@/lib/openSignup";
import { accountCopy } from "@/lib/translations/account";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const ui = investmentUi(await getLocale());
  return publicPageMetadata(ui.opportunities.metadataTitle, ui.opportunities.metadataDescription, {
    canonical: "/opportunities",
  });
}

type Params = {
  sector?: string;
  country?: string;
  stage?: string;
  instrument?: string;
  capital?: string;
  disclosure?: string;
  dataroom?: string;
  sponsor?: string;
  updated?: string;
  sort?: string;
};

function optionValues(values: string[]) {
  return ["All", ...Array.from(new Set(values)).sort()];
}

function matchesCapital(value: number | null | undefined, band: string) {
  if (band === "All") return true;
  if (!value) return false;
  if (band !== "All" && value <= 0) return false;
  if (band === "under-10") return value < 10_000_000;
  if (band === "10-50") return value >= 10_000_000 && value < 50_000_000;
  if (band === "50-100") return value >= 50_000_000 && value < 100_000_000;
  if (band === "100-plus") return value >= 100_000_000;
  return true;
}

function instrumentCategory(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("equipment")) return "Equipment finance";
  if (normalized.includes("dfi") || normalized.includes("impact")) return "DFI / impact capital";
  if (normalized.includes("programme") || normalized.includes("pillar")) return "Programme allocation";
  if (normalized.includes("spv")) return "Project SPV equity";
  if (normalized.includes("development") || normalized.includes("mining")) return "Project development capital";
  if (normalized.includes("equity")) return "Equity";
  if (normalized.includes("debt") || normalized.includes("loan")) return "Debt";
  return "Other";
}

function matchesUpdated(value: Date | undefined, band: string) {
  if (band === "All") return true;
  if (!value) return false;
  const ageDays = (Date.now() - new Date(value).getTime()) / 86_400_000;
  if (band === "30") return ageDays <= 30;
  if (band === "90") return ageDays <= 90;
  if (band === "older") return ageDays > 90;
  return true;
}

export default async function Opportunities({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const locale = await getLocale();
  const hero = getPublicHero(locale, "opportunities");
  const ui = investmentUi(locale).opportunities;
  const account = accountCopy(locale);
  const signupEnabled = openSignupConfig().enabled;
  const {
    sector = "All",
    country = "All",
    stage = "All",
    instrument = "All",
    capital = "All",
    disclosure = "All",
    dataroom = "All",
    sponsor = "All",
    updated = "All",
    sort = "latest",
  } = params;

  const rows = await prisma.listing.findMany({
    where: publicListingWhere,
    include: {
      org: true,
      images: true,
      docs: {
        where: { visibility: "restricted", lifecycle: "approved", storageKey: { not: null } },
        select: { id: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  const allListings = rows.map((row) => ({
        ...toListing({ ...row, docs: [] }),
        // Public pages receive readiness only, never confidential filenames.
        docs: row.docs.length > 0 ? [{ name: "", size: "", folder: "" }] : [],
      }));
  const sectors = optionValues(allListings.map((item) => item.sector));
  const countries = optionValues(allListings.map((item) => item.country));
  const stages = optionValues(allListings.map((item) => item.stage));
  const instruments = optionValues(allListings.map((item) => instrumentCategory(item.instrument)));
  const sponsors = optionValues(allListings.map((item) => item.org));
  const reviewStatuses = new Set(allListings.map((item) => item.verified));
  const hasDifferentiatingReviewStatus = reviewStatuses.size > 1;
  const commonReviewStatus = allListings[0]?.verified ?? false;

  let listings = allListings.filter((item) => {
    if (sector !== "All" && item.sector !== sector) return false;
    if (country !== "All" && item.country !== country) return false;
    if (stage !== "All" && item.stage !== stage) return false;
    if (instrument !== "All" && instrumentCategory(item.instrument) !== instrument) return false;
    if (sponsor !== "All" && item.org !== sponsor) return false;
    if (!matchesUpdated(item.updatedAt, updated)) return false;
    if (!matchesCapital(item.currentCapitalAskUsd, capital)) return false;
    if (disclosure === "reviewed" && !item.verified) return false;
    if (disclosure === "pending" && item.verified) return false;
    if (dataroom === "prepared" && item.docs.length === 0) return false;
    if (dataroom === "not-publicly-confirmed" && item.docs.length > 0) return false;
    return true;
  });

  if (sort === "capital") listings = [...listings].sort((a, b) => (b.currentCapitalAskUsd ?? -1) - (a.currentCapitalAskUsd ?? -1));
  if (sort === "updated") listings = [...listings].sort((a, b) => Number(b.updatedAt ?? 0) - Number(a.updatedAt ?? 0));
  if (sort === "stage") listings = [...listings].sort((a, b) => a.stage.localeCompare(b.stage));
  const localizedListings = listings.map((listing) => localizeListing(listing, locale));

  function localizedOption(name: string, option: string) {
    if (option === "All") return ui.all;
    if (name === "instrument") return instrumentCategoryCopy(locale, option);
    const source = allListings.find((listing) => {
      if (name === "sector") return listing.sector === option;
      if (name === "country") return listing.country === option;
      if (name === "stage") return listing.stage === option;
      if (name === "sponsor") return listing.org === option;
      return false;
    });
    if (!source) return option;
    const localized = localizeListing(source, locale);
    if (name === "sector") return localized.sector;
    if (name === "country") return localized.country;
    if (name === "stage") return localized.stage;
    return localized.org;
  }

  const selectClass = "min-h-11 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink focus:border-gold";
  const labelClass = "mb-1 block text-xs font-bold uppercase tracking-wide text-slate";

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        primary={signupEnabled ? { href: "/signup", label: account.createAccount } : { href: "/contact?topic=investor-access", label: hero.primary }}
        primaryNote={signupEnabled ? account.basicAccountNotice : t(locale, "access.investorQualifier")}
        secondary={{ href: "/diligence", label: hero.secondary }}
        aside={
          <div className="analytical-panel p-6 text-ink">
            <p className="eyebrow text-teal">{ui.screeningPrinciple}</p>
            <p className="mt-4 font-serif text-2xl leading-tight">{ui.screeningTitle}</p>
            <p className="mt-4 text-sm leading-6 text-slate">{ui.screeningBody}</p>
          </div>
        }
      />

      <section className="bg-ivory py-12 lg:py-16" aria-labelledby="opportunity-results">
        <div className="public-container">
          <SectionHeading
            eyebrow={ui.browse}
            title={ui.result(localizedListings.length)}
            body={ui.disclosureBody}
          />
          {!hasDifferentiatingReviewStatus && allListings.length > 0 && (
            <div className="mt-5 max-w-4xl">
              <QuietNotice>{catalogueReviewNote(locale, commonReviewStatus)}</QuietNotice>
            </div>
          )}

          <details className="group mt-8 rounded-lg border border-ink/10 bg-white lg:contents">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-3 font-display text-sm font-bold text-ink marker:content-none lg:hidden">
              <span>{ui.filterLabel}</span>
              <span aria-hidden="true" className="text-lg text-gold transition-transform group-open:rotate-45">＋</span>
            </summary>
            <form method="get" className="hidden border-t border-ink/10 p-4 group-open:block lg:mt-8 lg:block lg:rounded-lg lg:border lg:border-ink/10" aria-label={ui.filterLabel}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["sector", ui.sector, sector, sectors],
                ["country", ui.geography, country, countries],
                ["stage", ui.stage, stage, stages],
                ["instrument", ui.instrument, instrument, instruments],
                ["sponsor", ui.sponsor, sponsor, sponsors],
              ].map(([name, label, value, options]) => (
                <label key={name as string}>
                  <span className={labelClass}>{label as string}</span>
                  <select name={name as string} defaultValue={value as string} className={selectClass}>
                    {(options as string[]).map((option) => (
                      <option key={option} value={option}>
                        {localizedOption(name as string, option)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
              <label>
                <span className={labelClass}>{ui.capital}</span>
                <select name="capital" defaultValue={capital} className={selectClass}>
                  <option value="All">{ui.allSizes}</option>
                  <option value="under-10">{ui.under10}</option>
                  <option value="10-50">$10M–$50M</option>
                  <option value="50-100">$50M–$100M</option>
                  <option value="100-plus">$100M+</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>{ui.evidence}</span>
                <select name="disclosure" defaultValue={disclosure} className={selectClass}>
                  <option value="All">{ui.allStatuses}</option>
                  <option value="pending">{ui.pending}</option>
                  <option value="reviewed">{ui.reviewed}</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>{ui.roomReadiness}</span>
                <select name="dataroom" defaultValue={dataroom} className={selectClass}>
                  <option value="All">{ui.allStatuses}</option>
                  <option value="prepared">{ui.documentsRecorded}</option>
                  <option value="not-publicly-confirmed">{ui.notConfirmed}</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>{ui.updated}</span>
                <select name="updated" defaultValue={updated} className={selectClass}>
                  <option value="All">{ui.anyDate}</option>
                  <option value="30">{ui.past30}</option>
                  <option value="90">{ui.past90}</option>
                  <option value="older">{ui.older90}</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>{ui.sort}</span>
                <select name="sort" defaultValue={sort} className={selectClass}>
                  <option value="latest">{ui.latest}</option>
                  <option value="updated">{ui.recentlyUpdated}</option>
                  <option value="capital">{ui.capitalSize}</option>
                  <option value="stage">{ui.stage}</option>
                </select>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="button-primary" type="submit">{ui.apply}</button>
              <Link href="/opportunities" className="button-secondary">{ui.clear}</Link>
            </div>
            </form>
          </details>

          <ComparisonGrid listings={localizedListings} locale={locale} showReviewStatus={hasDifferentiatingReviewStatus} />

          {localizedListings.length === 0 && (
            <div className="mt-7">
              <QuietNotice>{ui.empty}</QuietNotice>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
