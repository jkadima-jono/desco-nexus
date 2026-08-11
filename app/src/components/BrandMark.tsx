import Image from "next/image";

export default function BrandMark({
  size = 40,
  showName = true,
  compactDesktop = false,
}: {
  size?: number;
  showName?: boolean;
  compactDesktop?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-3">
      <Image
        src="/brand/desco-coin.png"
        alt=""
        width={size}
        height={size}
        sizes={`${size}px`}
        className="object-contain"
      />
      {showName && (
        <span className={`font-display font-extrabold text-white ${compactDesktop ? "lg:hidden 2xl:inline" : ""}`}>
          DESCO <span className="text-gold">Compass</span>
        </span>
      )}
    </span>
  );
}
