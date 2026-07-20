import Link from "next/link";
import type { Listing } from "@/lib/data";
import { fmtUsd } from "@/lib/data";
import MatchRing from "./MatchRing";
import ScoreBars from "./ScoreBars";
import HeroVisual from "./HeroVisual";
import SectorBadge from "./SectorBadge";

export default function ProjectCard({
  listing,
  index = 0,
}: {
  listing: Listing;
  index?: number;
}) {
  return (
    <Link
      href={"/project/" + listing.id}
      className="card-rise group block bg-white rounded-2xl shadow-[0_1px_3px_rgb(44_62_80/0.08)] hover:shadow-[0_12px_32px_rgb(44_62_80/0.14)] transition-shadow overflow-hidden"
      style={{ animationDelay: index * 40 + "ms" }}
    >
      <HeroVisual listing={listing} className="h-44" />
      <div className="relative h-44 -mt-44 pointer-events-none">
        <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <span
              className="px-2 py-0.5 rounded-full text-white shadow-[0_1px_4px_rgb(16_22_29/0.3)]"
              style={{ background: listing.sectorColor }}
            >
              {listing.sector}
            </span>
            <span className="text-white/90 drop-shadow">
              {listing.flag} {listing.country}
            </span>
          </div>
          <SectorBadge sector={listing.sector} size={30} />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between">
          <div className="text-white drop-shadow">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-1">
              {listing.verified && <span className="text-gold">✓ Verified</span>}
              {listing.governmentBacked && (
                <span className="text-white/85">◆ Gov-backed</span>
              )}
            </div>
            <h3 className="font-display font-bold text-xl leading-snug max-w-md">
              {listing.title}
            </h3>
          </div>
          <div className="bg-ink/60 backdrop-blur-sm rounded-full p-1">
            <MatchRing score={listing.scores.match} size={52} onDark />
          </div>
        </div>
      </div>
      <div className="p-5 pt-4">
        <p className="text-sm text-wgray line-clamp-2">{listing.summary}</p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <div className="font-display font-extrabold text-2xl leading-none">
              {fmtUsd(listing.raiseUsd)}
            </div>
            <div className="text-[11px] text-wgray mt-1">
              {listing.instrument} · {listing.irr}
            </div>
          </div>
          <div className="w-44">
            <ScoreBars scores={listing.scores} />
          </div>
        </div>
      </div>
    </Link>
  );
}
