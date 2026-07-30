import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

type PublicationAction = "publish" | "pause" | "withdraw" | "archive";

function appendHistory(
  historyJson: string,
  entry: { by: string; action: PublicationAction; reason?: string; at: string },
) {
  try {
    const history = JSON.parse(historyJson);
    return JSON.stringify([...(Array.isArray(history) ? history : []), entry]);
  } catch {
    return JSON.stringify([entry]);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Administrator required" }, { status: 403 });

  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id }, include: { docs: true } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  let body: { action?: PublicationAction; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.action === "publish") {
    if (!listing.relatedPartyDisclosure.trim()) {
      return NextResponse.json({ error: "Related-party review is required before publication" }, { status: 409 });
    }
    if (listing.docs.length === 0) {
      return NextResponse.json({ error: "At least one indexed source document is required before publication" }, { status: 409 });
    }
    const at = new Date();
    const updated = await prisma.listing.update({
      where: { id },
      data: {
        publicationStatus: "public_teaser",
        designation: listing.designation === "removed" ? "candidate" : listing.designation,
        publishedAt: at,
        publishedBy: user.id,
        contentVersion: { increment: 1 },
        publicationHistory: appendHistory(listing.publicationHistory, {
          by: user.id,
          action: "publish",
          at: at.toISOString(),
        }),
      },
    });
    return NextResponse.json({ ok: true, listing: updated });
  }

  if (body.action === "pause" || body.action === "withdraw" || body.action === "archive") {
    const reason = body.reason?.trim();
    if (!reason) return NextResponse.json({ error: "A reason is required" }, { status: 400 });
    const publicationStatus =
      body.action === "pause" ? "paused" : body.action === "withdraw" ? "withdrawn" : "archived";
    const at = new Date();
    const updated = await prisma.listing.update({
      where: { id },
      data: {
        publicationStatus,
        designation: body.action === "pause" ? "paused" : "removed",
        contentVersion: { increment: 1 },
        publicationHistory: appendHistory(listing.publicationHistory, {
          by: user.id,
          action: body.action,
          reason,
          at: at.toISOString(),
        }),
      },
    });
    return NextResponse.json({ ok: true, reason, listing: updated });
  }

  return NextResponse.json({ error: "action must be publish|pause|withdraw|archive" }, { status: 400 });
}
