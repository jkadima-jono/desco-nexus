import Link from "next/link";
import type { Listing } from "@/lib/data";
import { fmtUsd } from "@/lib/data";
import HeroVisual from "./HeroVisual";
import SectorBadge from "./SectorBadge";

function formatUpdated(date: Date | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function ProjectCard({
  listing,
  index = 0,
  showMatchScore = false,
}: {
  listing: Listing;
  index?: number;
  /** Only pass true when the viewer is signed in with a saved, active mandate. */
  showMatchScore?: boolean;
}) {
  const verificationScope = listing.verified
    ? "Identity & registration reviewed"
    : "Not yet verified";
  const accessibleName = [
    listing.title,
    `${listing.country}`,
    `${listing.sector}, ${listing.stage}`,
    `${fmtUsd(listing.raiseUsd)} sought via ${listing.instrument}`,
    showMatchScore ? `${listing.scores.match}% mandate match` : null,
  ].filter(Boolean).join(", ");

  return (
    <Link
      href={"/project/" + listing.id}
      aria-label={accessibleName}
      className="card-rise group block bg-white rounded-2xl border border-charcoal/10 hover:border-gold/50 shadow-[0_1px_3px_rgb(44_62_80/0.06)] hover:shadow-[0_8px_24px_rgb(44_62_80/0.10)] transition-all overflow-hidden"
      style={{ animationDelay: index * 40 + "ms" }}
    >
      <HeroVisual listing={listing} className="h-40" />
      <div className="relative h-40 -mt-40 pointer-events-none">
        <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <span className="px-2 py-0.5 rounded-full text-white shadow-[0_1px_4px_rgb(16_22_29/0.3)]" style={{ background: listing.sectorColor }}>
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

      <div className="p-5 pt-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-wgray mb-2">
          <span>{listing.stage}</span>
          {showMatchScore && (
            <span className="ml-auto text-gold">{listing.scores.match}% mandate match</span>
          )}
        </div>

        <p className="text-sm text-wgray line-clamp-2 leading-relaxed">{listing.summary}</p>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <div className="font-display font-extrabold text-2xl leading-none">
              {fmtUsd(listing.raiseUsd)}
            </div>
            <div className="text-[11px] text-wgray mt-1">{listing.instrument}</div>
          </div>
          <div className="text-right text-[11px] text-wgray">
            <div className="font-semibold text-charcoal">{listing.org}</div>
            <div>Sponsor</div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-charcoal/10 flex items-center justify-between text-[11px] text-wgray">
          <span className={listing.verified ? "text-gold font-semibold" : ""}>
            {listing.verified && "✓ "}{verificationScope}
          </span>
          <span>Updated {formatUpdated(listing.updatedAt)}</span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-sm font-bold text-charcoal group-hover:text-gold">
          View opportunity <span aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  );
}
