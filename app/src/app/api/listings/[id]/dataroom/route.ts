import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageListing, unauthorized, forbidden } from "@/lib/authz";

// Sponsor/admin view of a listing's data room: who requested access (via
// the existing "dataroom_requested" MatchAction) cross-referenced with who
// currently holds an active DataRoomAccess grant.
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

  const [requests, grants] = await Promise.all([
    prisma.matchAction.findMany({
      where: { listingId: id, action: "dataroom_requested" },
      distinct: ["userId"],
      include: { user: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.dataRoomAccess.findMany({ where: { listingId: id }, include: { user: true } }),
  ]);

  const grantByUser = new Map(grants.map((g) => [g.userId, g]));
  const requesters = requests.map((r) => {
    const grant = grantByUser.get(r.userId);
    return {
      userId: r.userId,
      fullName: r.user.fullName,
      email: r.user.email,
      requestedAt: r.createdAt,
      granted: !!grant && grant.revokedAt === null,
      revoked: !!grant && grant.revokedAt !== null,
      grantedAt: grant?.createdAt ?? null,
    };
  });

  return NextResponse.json({ requesters });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (!canManageListing(user, listing)) return forbidden();

  let body: { userId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const grant = await prisma.dataRoomAccess.upsert({
    where: { listingId_userId: { listingId: id, userId: body.userId } },
    update: { revokedAt: null, grantedBy: user.fullName },
    create: { listingId: id, userId: body.userId, grantedBy: user.fullName },
  });
  return NextResponse.json({ ok: true, grant });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (!canManageListing(user, listing)) return forbidden();

  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const grant = await prisma.dataRoomAccess.findUnique({
    where: { listingId_userId: { listingId: id, userId } },
  });
  if (!grant) return NextResponse.json({ error: "No grant found" }, { status: 404 });

  await prisma.dataRoomAccess.update({
    where: { listingId_userId: { listingId: id, userId } },
    data: { revokedAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}
