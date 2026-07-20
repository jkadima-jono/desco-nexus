import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (user.role !== "owner" && user.role !== "admin") {
    return NextResponse.json({ error: "Not permitted for your role" }, { status: 403 });
  }
  if (!user.orgId && user.role !== "admin") {
    return NextResponse.json({ engagements: [] });
  }

  const listings = await prisma.listing.findMany({
    where: user.role === "admin" ? {} : { orgId: user.orgId! },
    select: { id: true, title: true },
  });
  const listingIds = listings.map((l) => l.id);
  const titleById = Object.fromEntries(listings.map((l) => [l.id, l.title]));

  const actions = await prisma.matchAction.findMany({
    where: { listingId: { in: listingIds } },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { fullName: true, email: true } } },
  });

  const byInvestorListing = new Map<string, (typeof actions)[number]>();
  for (const a of actions) {
    const key = a.userId + ":" + a.listingId;
    if (!byInvestorListing.has(key)) byInvestorListing.set(key, a);
  }

  const engagements = [...byInvestorListing.values()].map((a) => ({
    investor: a.user.fullName,
    listing: titleById[a.listingId] ?? "Unknown",
    stage: a.action,
    lastActivity: a.createdAt,
  }));

  return NextResponse.json({ engagements });
}
