import Link from "next/link";
import type { Listing } from "@/lib/data";
import { isDescoRelatedOpportunity, materialFactPresentation } from "@/lib/data";
import HeroVisual from "./HeroVisual";
import { getInvestmentEvidence, screeningReadiness, sourceDatePresentation } from "@/lib/investment-evidence";
import { sectorForeground } from "@/lib/theme";
import type { Locale } from "@/lib/i18n";
import { investmentUi, materialFactCopy, screeningReadinessCopy } from "@/lib/translations/investment-ui";
import DisclosureCompleteness from "./DisclosureCompleteness";
import { localizeInvestmentEvidence, localizeListing, organizationPresentation } from "@/lib/translations/listing-content";
import { projectHref } from "@/lib/project-slugs";
import Button from "./ui/Button";

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
  const rawEvidence = getInvestmentEvidence(listing);
  const readiness = screeningReadiness(rawEvidence, listing.currentCapitalAskUsd);
  listing = localizeListing(listing, locale);
  const ui = investmentUi(locale).card;
  const readinessUi = screeningReadinessCopy(locale);
  const verificationScope = listing.verified
    ? ui.reviewed
    : ui.pending;
  const investmentEvidence = localizeInvestmentEvidence(rawEvidence, locale);
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
    <article
      className="card-rise group overflow-hidden border border-desco-hairline bg-white transition-colors hover:border-desco-red"
      style={{ animationDelay: index * 40 + "ms" }}
    >
      <HeroVisual listing={listing} className="h-32 sm:h-40" locale={locale} contextLabelClassName="right-4 top-12 max-w-[calc(100%-5rem)]" />

      <div className="p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.12em]">
          <span style={{ color: listing.sectorColor }}>{listing.sector}</span>
          <span className="text-slate">· {listing.flag} {listing.country}</span>
        </div>
        <h3 className="font-sans text-[27px] font-semibold uppercase leading-[1.05] text-black">
          <Link href={projectHref(listing.id)} aria-label={accessibleName} className="focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-desco-gold">
            {listing.title}
          </Link>
        </h3>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`disclosure-chip ${readiness.ready ? "disclosure-reviewed" : "disclosure-pending"}`}>
            {readiness.ready ? readinessUi.ready : readinessUi.preparation}
          </span>
          {!readiness.ready && (
            <span className="text-[11px] leading-4 text-slate">
              {readiness.gaps.map((gap) => readinessUi.gaps[gap]).join(" · ")}
            </span>
          )}
        </div>
        <div className="mb-2 flex min-h-9 items-start gap-2 text-[11px] font-bold uppercase leading-4 tracking-wider text-wgray">
          <span className="break-words">{listing.stage}</span>
        </div>

        <p className="mt-4 line-clamp-3 font-sans text-[17px] leading-[1.7] text-desco-slate">{listing.summary}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,auto)] sm:items-end">
          <div className="min-w-0">
            <div className={fact.kind === "not_disclosed" ? "text-sm font-semibold leading-5 text-slate" : "break-words font-sans text-5xl font-bold leading-none text-desco-red"}>
              {fact.value}
            </div>
            {fact.kind !== "not_disclosed" && <div className="mt-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-desco-slate">{factCopy.label}</div>}
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
          <Button href={projectHref(listing.id)} variant="small" aria-label={accessibleName}>
            {ui.review} <span aria-hidden="true">→</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
