import type { Listing } from "@/lib/data";
import { exampleProjectImages } from "@/lib/example-project-images";
import type { Locale } from "@/lib/i18n";
import { investmentUi } from "@/lib/translations/investment-ui";
import Image from "next/image";
import { isPublicOpportunityId } from "@/lib/public-listings";

// Deterministic pattern pick per listing (brand: African-inspired geometric
// library — circular unity, connected nodes, radial burst).
function variantOf(id: string): number {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return h % 3;
}

function Pattern({ variant, color }: { variant: number; color: string }) {
  if (variant === 0) {
    // circular unity: concentric rings
    return (
      <g fill="none" stroke="#FFFFFF" strokeOpacity="0.14">
        {[28, 56, 84, 112, 140].map((r) => (
          <circle key={r} cx="340" cy="30" r={r} strokeWidth="2" />
        ))}
        <circle cx="60" cy="150" r="46" strokeWidth="2" />
        <circle cx="60" cy="150" r="24" strokeWidth="2" />
      </g>
    );
  }
  if (variant === 1) {
    // connected nodes
    const nodes: [number, number][] = [
      [40, 40], [150, 90], [260, 36], [360, 100], [90, 150], [230, 140], [330, 170],
    ];
    return (
      <g>
        {nodes.map(([x, y], i) =>
          nodes.slice(i + 1, i + 3).map(([x2, y2], j) => (
            <line key={i + "-" + j} x1={x} y1={y} x2={x2} y2={y2}
              stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="1.5" />
          ))
        )}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" fill="#FFFFFF" fillOpacity="0.22" />
        ))}
      </g>
    );
  }
  // radial burst
  return (
    <g stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="2">
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i * Math.PI) / 7;
        return (
          <line key={i} x1="360" y1="180"
            x2={360 + Math.cos(a) * 210} y2={180 + Math.sin(a) * 210} />
        );
      })}
      <circle cx="360" cy="180" r="34" fill={color} stroke="none" opacity="0.5" />
    </g>
  );
}

export default function HeroVisual({
  listing,
  className = "",
  overlay = true,
  locale = "en",
  priority = false,
  contextLabelClassName = "right-3 top-3",
}: {
  listing: Listing;
  className?: string;
  overlay?: boolean;
  locale?: Locale;
  priority?: boolean;
  contextLabelClassName?: string;
}) {
  const ui = investmentUi(locale).images;
  const controlledExample = exampleProjectImages(listing.id)[0];
  const photo = isPublicOpportunityId(listing.id)
    ? listing.photos?.find((item) => !item.isExample)
    : listing.photos?.[0] ?? controlledExample;
  if (photo) {
    return (
      <div className={"relative overflow-hidden " + className}>
        <Image
          src={photo.url}
          alt=""
          fill
          priority={priority}
          sizes={priority ? "100vw" : "(min-width: 1024px) 38rem, 100vw"}
          className="object-cover"
        />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        )}
        {photo.isExample && (
          <span className={`absolute max-w-[calc(100%-1.5rem)] whitespace-normal rounded-md bg-ink/90 px-2.5 py-1 text-right text-[10px] font-bold uppercase leading-4 tracking-[0.06em] text-white shadow-sm ${contextLabelClassName}`} title={photo.caption ?? (photo.kind === "regional" ? ui.regional : ui.example)}>
            {photo.kind === "regional" ? ui.regional : ui.example}
          </span>
        )}
      </div>
    );
  }
  const v = variantOf(listing.id);
  return (
    <div className={"relative overflow-hidden " + className}>
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <defs>
          <linearGradient id={"g-" + listing.id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={listing.sectorColor} />
            {/* matches --color-navy in globals.css */}
            <stop offset="100%" stopColor="#18334A" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill={"url(#g-" + listing.id + ")"} />
        <Pattern variant={v} color={listing.sectorColor} />
      </svg>
    </div>
  );
}
