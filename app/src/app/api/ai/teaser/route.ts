import { NextResponse } from "next/server";
import { prisma, toListing } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { generateTeaser } from "@/lib/ai";
import { canManageListing, forbidden } from "@/lib/authz";
import { applyRateLimit, rejectUntrustedOrigin } from "@/lib/request-security";

export async function POST(req: Request) {
  const originError = rejectUntrustedOrigin(req);
  if (originError) return originError;
  const limited = await applyRateLimit(req, "ai-teaser", 10, 60_000);
  if (limited) return limited;
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  let body: { listingId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.listingId) {
    return NextResponse.json({ error: "listingId required" }, { status: 400 });
  }
  const row = await prisma.listing.findUnique({
    where: { id: body.listingId },
    include: { org: true },
  });
  if (!row) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  if (!canManageListing(user, row)) {
    return forbidden();
  }
  const { teaser, source } = await generateTeaser(toListing(row));
  await prisma.aiGenerationLog.create({
    data: { userId: user.id, kind: "teaser", source, listingId: row.id },
  });
  return NextResponse.json({
    ok: true,
    teaser,
    source,
    sources: ["title", "sponsor", "sector", "country", "raise", "instrument", "stage", "returnProfile", "summary", "highlights"],
    reviewRequired: true,
  });
}
