import { NextResponse } from "next/server";
import { prisma, toListing } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { sanitizePublicListing } from "@/lib/data";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const saved = await prisma.savedOpportunity.findMany({
    where: { userId: user.id },
    include: { listing: { include: { org: true } }, collection: true },
    orderBy: { createdAt: "desc" },
  });
  const publicSafeSaved = saved.map(({ listing, ...item }) => ({
    ...item,
    listing: sanitizePublicListing(toListing(listing)),
  }));
  return NextResponse.json({ saved: publicSafeSaved });
}
