import Image from "next/image";

export default function BrandMark({ size = 40, showName = true }: { size?: number; showName?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <Image src="/brand/desco-compass-logo.jpg" alt="" width={size} height={size} sizes={`${size}px`} className="rounded-full object-cover" />
      {showName && <span className="font-display font-extrabold text-white">DESCO <span className="text-gold">Compass</span></span>}
    </span>
  );
}
