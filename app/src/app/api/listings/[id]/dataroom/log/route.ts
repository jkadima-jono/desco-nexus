import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageListing, unauthorized, forbidden } from "@/lib/authz";

// Sponsor/admin audit trail: every confidential document download for
// this listing, logged by /api/documents/[id] on each successful GET.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (!canManageListing(user, listing)) return forbidden();

  const logs = await prisma.documentAccessLog.findMany({
    where: { document: { listingId: id } },
    include: { user: true, document: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({
    logs: logs.map((l) => ({
      id: l.id,
      documentName: l.document.name,
      userFullName: l.user.fullName,
      userEmail: l.user.email,
      createdAt: l.createdAt,
    })),
  });
}
