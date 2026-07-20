import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const { id } = await params;

  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      listing: { include: { org: true } },
      capitalCalls: { orderBy: { noticeDate: "asc" } },
      distributions: { orderBy: { paymentDate: "asc" } },
      updates: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!deal) {
    return NextResponse.json({ error: "Position not found" }, { status: 404 });
  }

  // Position-level access: only investors who acted "interested" on the
  // underlying listing may view it — prevents any signed-in user from
  // browsing another investor's capital account by guessing deal ids.
  const owns = await prisma.matchAction.findFirst({
    where: { userId: user.id, listingId: deal.listingId, action: "interested" },
  });
  if (!owns) {
    return NextResponse.json({ error: "Position not found" }, { status: 404 });
  }

  return NextResponse.json({ deal });
}
