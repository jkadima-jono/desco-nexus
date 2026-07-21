import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

// Admin-only for now: deals carry negotiation-sensitive detail (stage,
// history, decision notes), so a general list endpoint stays restricted
// until per-org filtering is built. Sponsors/investors use the
// server-rendered pipeline pages, which already scope what they see.
export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Not permitted for your role" }, { status: 403 });

  const listingId = new URL(req.url).searchParams.get("listingId");
  const deals = await prisma.deal.findMany({
    where: listingId ? { listingId } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ deals });
}
