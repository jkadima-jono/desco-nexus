import Link from "next/link";
import type { Listing } from "@/lib/data";
import { capitalPresentation } from "@/lib/data";
import HeroVisual from "./HeroVisual";
import SectorBadge from "./SectorBadge";
import { getInvestmentEvidence, summarizeEvidence } from "@/lib/investment-evidence";
import { sectorForeground } from "@/lib/theme";
import type { Locale } from "@/lib/i18n";
import { investmentUi } from "@/lib/translations/investment-ui";
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
  listing = localizeListing(listing, locale);
  const ui = investmentUi(locale).card;
  const verificationScope = listing.verified
    ? ui.reviewed
    : ui.pending;
  const capital = capitalPresentation(listing);
  const accessibleName = [
    listing.title,
    listing.country,
    `${capital.label}: ${capital.value}`,
  ].filter(Boolean).join(", ");
  const evidence = summarizeEvidence(getInvestmentEvidence(listing));

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
              style={{ background: listing.sectorColor, color: sectorForeground(listing.sector) }}
            >
              {listing.sector}
            </span>
            <span className="text-white/90 drop-shadow">{listing.flag} {listing.country}</span>
          </div>
          <SectorBadge sector={listing.sector} size={28} />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display font-bold text-lg leading-snug max-w-md text-white drop-shadow">
            {listing.title}
          </h3>
        </div>
      </div>

      <div className="p-4 sm:p-5 sm:pt-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-wgray mb-2">
          <span>{listing.stage}</span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-wgray">{listing.summary}</p>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <div className="font-display font-extrabold text-2xl leading-none">
              {capital.value}
            </div>
            <div className="mt-1 text-xs font-semibold text-slate">{listing.raiseUsd > 0 ? ui.capitalSought : ui.capitalNotDisclosed}</div>
            <div className="mt-1 line-clamp-1 text-xs text-wgray">{listing.instrument}</div>
          </div>
          <div className="text-right text-[11px] text-wgray">
            <div className="font-semibold text-charcoal">{listing.org}</div>
            <div>{ui.sponsor}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-charcoal/10 pt-3 text-xs text-wgray">
          <span className={`line-clamp-1 ${listing.verified ? "text-gold font-semibold" : ""}`}>
            {listing.verified && "✓ "}{verificationScope}
          </span>
          <span>{ui.updated} {formatUpdated(listing.updatedAt, locale)}</span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="line-clamp-1 rounded-full border border-charcoal/15 bg-mist px-2.5 py-1 text-xs font-bold text-slate">
            {ui.evidence} {evidence.disclosed}/{evidence.total} · {ui.risks} {evidence.risksDisclosed}/{evidence.risksTotal}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-bold text-charcoal group-hover:text-gold">
            {ui.review} <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
