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
      alt=""
      width={size}
      height={size}
      className="rounded-full shrink-0 object-cover bg-white/10"
      style={{ width: size, height: size }}
    />
  );
}
