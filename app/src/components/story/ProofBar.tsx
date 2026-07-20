import { prisma } from "@/lib/db";
import StatCounter from "./StatCounter";
import Reveal from "./Reveal";

// Real aggregate metrics only — never hardcoded, per docs/10 §11.
export default async function ProofBar() {
  const [listingCount, investorCount, closedDeals, totalRaise] = await Promise.all([
    prisma.listing.count(),
    prisma.user.count({ where: { role: "investor" } }),
    prisma.deal.count({ where: { stage: "Term Sheet" } }),
    prisma.listing.aggregate({ _sum: { raiseUsd: true } }),
  ]);
  const totalRaiseM = Math.round((totalRaise._sum.raiseUsd ?? 0) / 1_000_000);

  return (
    <div className="bg-charcoal text-white py-8">
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <Reveal><StatCounter value={listingCount} label="Live opportunities" onDark /></Reveal>
        <Reveal delay={80}><StatCounter value={investorCount} label="Registered investors" onDark /></Reveal>
        <Reveal delay={160}><StatCounter value={closedDeals} label="Deals in closing" onDark /></Reveal>
        <Reveal delay={240}><StatCounter value={totalRaiseM} suffix="M" label="Total capital sought ($)" onDark /></Reveal>
      </div>
    </div>
  );
}
