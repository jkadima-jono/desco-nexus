import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const saved = await prisma.savedOpportunity.findMany({
    where: { userId: user.id },
    include: { listing: { include: { org: true } }, collection: true },
    orderBy: { createdAt: "desc" },
  });
  const publicSafeSaved = saved.map((item) => {
    const { irr: _irr, whyMatch: _whyMatch, ...publicListing } = item.listing;
    return { ...item, listing: publicListing };
  });
  return NextResponse.json({ saved: publicSafeSaved });
}
