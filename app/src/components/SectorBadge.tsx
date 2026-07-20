import { SECTOR_TO_PILLAR, pillarIcon } from "@/lib/theme";

export default function SectorBadge({
  sector,
  size = 28,
}: {
  sector: string;
  size?: number;
}) {
  const pillarSlug = SECTOR_TO_PILLAR[sector];
  if (!pillarSlug) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={pillarIcon(pillarSlug)}
      alt={"Desco pillar: " + sector}
      width={size}
      height={size}
      title={"Desco pillar · " + sector}
      className="rounded-full shadow-[0_1px_4px_rgb(16_22_29/0.35)] shrink-0 object-cover bg-white/10"
      style={{ width: size, height: size }}
    />
  );
}
