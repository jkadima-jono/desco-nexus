const PILLAR: Record<string, string> = {
  Agriculture: "/brand/pillars/agri.png",
  Healthcare: "/brand/pillars/phar.png",
  Water: "/brand/pillars/water.png",
  Fintech: "/brand/pillars/invest.png",
  Infrastructure: "/brand/pillars/invest.png",
  "Renewable Energy": "/brand/pillars/invest.png",
};

export default function SectorBadge({
  sector,
  size = 28,
}: {
  sector: string;
  size?: number;
}) {
  const src = PILLAR[sector];
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={sector}
      width={size}
      height={size}
      title={"Desco pillar · " + sector}
      className="rounded-full shadow-[0_1px_4px_rgb(16_22_29/0.35)] shrink-0 object-cover"
      style={{ width: size, height: size }}
    />
  );
}
