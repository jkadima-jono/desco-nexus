import { prisma } from "@/lib/db";

// Real aggregate metrics only, never hardcoded. Limited to figures that
// stay meaningful regardless of current platform usage (opportunity count,
// capital sought) rather than user-count metrics that read as thin at
// this stage (e.g. "1 registered investor") and would overstate traction.
export default async function ProofBar() {
  const [listingCount, totalRaise] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.aggregate({ _sum: { raiseUsd: true } }),
  ]);
  const totalRaiseM = Math.round((totalRaise._sum.raiseUsd ?? 0) / 1_000_000);

  return (
    <div className="text-white py-8" style={{ background: "linear-gradient(90deg, var(--color-ink-2) 0%, var(--color-navy) 100%)" }}>
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 gap-6 text-center">
        <div>
          <div className="font-display font-extrabold text-4xl lg:text-5xl tracking-tight text-white">{listingCount}</div>
          <div className="text-xs lg:text-sm mt-1 uppercase tracking-wider font-bold text-white/60">Live opportunities</div>
        </div>
        <div>
          <div className="font-display font-extrabold text-4xl lg:text-5xl tracking-tight text-white">${totalRaiseM}M</div>
          <div className="text-xs lg:text-sm mt-1 uppercase tracking-wider font-bold text-white/60">Total capital sought</div>
        </div>
      </div>
    </div>
  );
}
