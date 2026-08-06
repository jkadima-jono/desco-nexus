import Link from "next/link";
import type { Listing } from "@/lib/data";
import { isDescoRelatedOpportunity, materialFactPresentation } from "@/lib/data";
import HeroVisual from "./HeroVisual";
import { getInvestmentEvidence, sourceDatePresentation } from "@/lib/investment-evidence";
import { sectorForeground } from "@/lib/theme";
import type { Locale } from "@/lib/i18n";
import { investmentUi, materialFactCopy } from "@/lib/translations/investment-ui";
import DisclosureCompleteness from "./DisclosureCompleteness";
import { localizeInvestmentEvidence, localizeListing, organizationPresentation } from "@/lib/translations/listing-content";
import { projectHref } from "@/lib/project-slugs";

export default function ProjectCard({
  listing,
  index = 0,
  locale = "en",
  showReviewStatus = true,
}: {
  listing: Listing;
  index?: number;
  locale?: Locale;
  showReviewStatus?: boolean;
}) {
  const sectorKey = listing.sectorKey ?? listing.sector;
  listing = localizeListing(listing, locale);
  const ui = investmentUi(locale).card;
  const verificationScope = listing.verified
    ? ui.reviewed
    : ui.pending;
  const investmentEvidence = localizeInvestmentEvidence(getInvestmentEvidence(listing), locale);
  const sourceDate = sourceDatePresentation(investmentEvidence.provenance.sourceDate);
  const localizedSourceDate = sourceDate.date && sourceDate.label?.includes(" ")
    ? sourceDate.date.toLocaleDateString(locale, { month: "short", year: "numeric", timeZone: "UTC" })
    : sourceDate.label;
  const fact = materialFactPresentation(listing, investmentEvidence.provenance.sourceDate);
  const factCopy = materialFactCopy(locale, fact.kind, fact.sourceDate);
  const organization = organizationPresentation(listing.id, locale);
  const accessibleName = [
    listing.title,
    listing.country,
    listing.stage,
    listing.org,
    organization?.role,
    organization?.context,
    `${factCopy.label}: ${fact.value}`,
  ].filter(Boolean).join(", ");
  return (
    <Link
      href={projectHref(listing.id)}
      aria-label={accessibleName}
      className="card-rise group block overflow-hidden rounded-xl border border-charcoal/10 bg-white shadow-[0_1px_3px_rgb(44_62_80/0.06)] transition-all hover:border-gold/50 hover:shadow-[0_8px_24px_rgb(44_62_80/0.10)]"
      style={{ animationDelay: index * 40 + "ms" }}
    >
      <HeroVisual listing={listing} className="h-32 sm:h-40" locale={locale} contextLabelClassName="right-4 top-12 max-w-[calc(100%-5rem)]" />
      <div className="relative h-32 -mt-32 sm:h-40 sm:-mt-40 pointer-events-none">
        <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <span
              className="px-2 py-0.5 rounded-full shadow-[0_1px_4px_rgb(16_22_29/0.3)]"
              style={{ background: listing.sectorColor, color: sectorForeground(sectorKey) }}
            >
              {listing.sector}
            </span>
            <span className="rounded bg-ink/90 px-2 py-1 text-white shadow-sm">
              {listing.flag} {listing.country}
            </span>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="max-w-md font-display text-lg font-bold leading-snug text-white">
            <span className="box-decoration-clone rounded bg-ink/90 px-2 py-1 shadow-sm">
              {listing.title}
            </span>
          </h3>
        </div>
      </div>

      <div className="p-4 sm:p-5 sm:pt-4">
        <div className="mb-2 flex min-h-9 items-start gap-2 text-[11px] font-bold uppercase leading-4 tracking-wider text-wgray">
          <span className="break-words">{listing.stage}</span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-wgray">{listing.summary}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,auto)] sm:items-end">
          <div className="min-w-0">
            <div className={fact.kind === "not_disclosed" ? "text-sm font-semibold leading-5 text-slate" : "break-words font-display text-2xl font-extrabold leading-tight"}>
              {fact.value}
            </div>
            {fact.kind !== "not_disclosed" && <div className="mt-1 text-xs font-semibold text-slate">{factCopy.label}</div>}
            {fact.kind === "estimated_cost" && <div className="mt-1 text-xs text-wgray">{factCopy.capitalGap}</div>}
            <div className="mt-1 line-clamp-1 text-xs text-wgray">{listing.instrument}</div>
          </div>
          <div className="min-w-0 text-left text-[11px] text-wgray sm:text-right">
            <div className="break-words font-semibold text-charcoal">{listing.org}</div>
            <div>{organization?.role ?? ui.sponsor}</div>
            {organization?.context && <div className="mt-1 leading-4 text-slate">{organization.context}</div>}
          </div>
        </div>

        <div className={`mt-4 grid gap-1 border-t border-charcoal/10 pt-3 text-xs text-wgray ${showReviewStatus ? "sm:grid-cols-[minmax(0,1fr)_auto]" : "sm:grid-cols-1"} sm:gap-3`}>
          {showReviewStatus && (
            <span className={listing.verified ? "font-semibold text-gold" : ""}>
              {listing.verified && "✓ "}{verificationScope}
            </span>
          )}
          <span className={showReviewStatus ? "sm:text-right" : ""}>
            {localizedSourceDate
              ? `${ui.source}: ${localizedSourceDate}${sourceDate.ageMonths == null ? "" : ` · ${ui.ageMonths(sourceDate.ageMonths)}`}`
              : ui.sourceUndated}
          </span>
        </div>

        {isDescoRelatedOpportunity(listing) && (
          <div className="mt-3 text-[11px] font-bold uppercase tracking-wide text-rust">
            {ui.relatedParty}
          </div>
        )}

        <div className="mt-3 flex flex-col items-stretch justify-between gap-3 border-t border-charcoal/10 pt-3 sm:flex-row sm:items-end">
          <DisclosureCompleteness evidence={investmentEvidence} locale={locale} compact />
          <span className="flex items-center gap-1.5 text-sm font-bold text-charcoal group-hover:text-gold">
            {ui.review} <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
