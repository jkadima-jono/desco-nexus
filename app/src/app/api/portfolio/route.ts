import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

// A "position" is any deal this investor's actions (interested/saved/follow)
// opened — deals are user-scoped via MatchAction, not by deal.owner alone,
// so cross-user positions never leak.
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const actedListingIds = (
    await prisma.matchAction.findMany({
      where: { userId: user.id, action: "interested" },
      select: { listingId: true },
      distinct: ["listingId"],
    })
  ).map((a) => a.listingId);

  const deals = await prisma.deal.findMany({
    where: { listingId: { in: actedListingIds } },
    include: {
      listing: { include: { org: true } },
      capitalCalls: true,
      distributions: true,
    },
  });

  const positions = deals.map((d) => {
    const called = d.capitalCalls.reduce((a, c) => a + c.amountUsd, 0);
    const distributed = d.distributions.reduce((a, c) => a + c.amountUsd, 0);
    return {
      dealId: d.id,
      title: d.title,
      flag: d.flag,
      sponsor: d.listing.org.name,
      stage: d.stage,
      committedUsd: d.listing.raiseUsd,
      calledUsd: called,
      distributedUsd: distributed,
      currentValueUsd: called - distributed,
    };
  });

  return NextResponse.json({ positions });
}
