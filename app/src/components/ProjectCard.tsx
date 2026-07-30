import Link from "next/link";
import type { Listing } from "@/lib/data";
import { capitalPresentation, isDescoRelatedOpportunity } from "@/lib/data";
import HeroVisual from "./HeroVisual";
import SectorBadge from "./SectorBadge";
import { evidenceDisclosureStatus, getInvestmentEvidence, summarizeEvidence } from "@/lib/investment-evidence";
import { sectorForeground } from "@/lib/theme";
import type { Locale } from "@/lib/i18n";
import { disclosureStatusCopy, investmentUi, localizedCapitalPresentation } from "@/lib/translations/investment-ui";
import { localizeListing } from "@/lib/translations/listing-content";
import { projectHref } from "@/lib/project-slugs";

function formatUpdated(date: Date | undefined, locale: Locale): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}

export default function ProjectCard({
  listing,
  index = 0,
  locale = "en",
}: {
  listing: Listing;
  index?: number;
  locale?: Locale;
}) {
  const sectorKey = listing.sectorKey ?? listing.sector;
  listing = localizeListing(listing, locale);
  const ui = investmentUi(locale).card;
  const verificationScope = listing.verified
    ? ui.reviewed
    : ui.pending;
  const capital = localizedCapitalPresentation(locale, capitalPresentation(listing));
  const capitalValue = capital.value;
  const accessibleName = [
    listing.title,
    listing.country,
    `${capital.label}: ${capital.value}`,
  ].filter(Boolean).join(", ");
  const evidence = summarizeEvidence(getInvestmentEvidence(listing));
  const disclosureStatus = disclosureStatusCopy(locale, evidenceDisclosureStatus(evidence));

  return (
    <Link
      href={projectHref(listing.id)}
      aria-label={accessibleName}
      className="card-rise group block overflow-hidden rounded-xl border border-charcoal/10 bg-white shadow-[0_1px_3px_rgb(44_62_80/0.06)] transition-all hover:border-gold/50 hover:shadow-[0_8px_24px_rgb(44_62_80/0.10)]"
      style={{ animationDelay: index * 40 + "ms" }}
    >
      <HeroVisual listing={listing} className="h-32 sm:h-40" locale={locale} />
      <div className="relative h-32 -mt-32 sm:h-40 sm:-mt-40 pointer-events-none">
        <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <span
              className="px-2 py-0.5 rounded-full shadow-[0_1px_4px_rgb(16_22_29/0.3)]"
              style={{ background: listing.sectorColor, color: sectorForeground(sectorKey) }}
            >
              {listing.sector}
            </span>
            <span className="text-white/90 drop-shadow">{listing.flag} {listing.country}</span>
          </div>
          <SectorBadge sector={sectorKey} size={28} />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display font-bold text-lg leading-snug max-w-md text-white drop-shadow">
            {listing.title}
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
            <div className="break-words font-display text-2xl font-extrabold leading-tight">
              {capitalValue}
            </div>
            <div className="mt-1 text-xs font-semibold text-slate">{capital.label}</div>
            <div className="mt-1 line-clamp-1 text-xs text-wgray">{listing.instrument}</div>
          </div>
          <div className="min-w-0 text-left text-[11px] text-wgray sm:text-right">
            <div className="break-words font-semibold text-charcoal">{listing.org}</div>
            <div>{ui.sponsor}</div>
          </div>
        </div>

        <div className="mt-4 grid gap-1 border-t border-charcoal/10 pt-3 text-xs text-wgray sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-3">
          <span className={listing.verified ? "font-semibold text-gold" : ""}>
            {listing.verified && "✓ "}{verificationScope}
          </span>
          <span className="sm:text-right">{ui.updated} {formatUpdated(listing.updatedAt, locale)}</span>
        </div>

        {isDescoRelatedOpportunity(listing) && (
          <div className="mt-3 text-[11px] font-bold uppercase tracking-wide text-rust">
            {ui.relatedParty}
          </div>
        )}

        <div className="mt-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <span className="rounded-full border border-charcoal/15 bg-mist px-2.5 py-1 text-xs font-bold leading-5 text-slate">
            {disclosureStatus}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-bold text-charcoal group-hover:text-gold">
            {ui.review} <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
