import { redirect } from "next/navigation";
import { prisma, toListing } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import MatchFlow from "./MatchFlow";
import { PUBLIC_LISTING_STATUS } from "@/lib/public-listings";

export const dynamic = "force-dynamic";

export default async function Match() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const acted = await prisma.matchAction.findMany({
    where: { userId: user.id },
    select: { listingId: true },
  });
  const actedIds = acted.map((a) => a.listingId);
  const rows = await prisma.listing.findMany({
    where: {
      publicationStatus: PUBLIC_LISTING_STATUS,
      ...(actedIds.length ? { id: { notIn: actedIds } } : {}),
    },
    include: { org: true, images: true },
    orderBy: { updatedAt: "desc" },
  });
  return <MatchFlow queue={rows.map(toListing)} />;
}
