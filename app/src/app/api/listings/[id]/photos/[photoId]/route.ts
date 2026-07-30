import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageListing, unauthorized, forbidden } from "@/lib/authz";
import { enqueueOutbox } from "@/lib/outbox";
import { Prisma } from "@prisma/client";
import { invalidatePublicationForImageChange } from "@/lib/invalidate-publication";

async function loadAuthorized(id: string, photoId: string) {
  const user = await getSessionUser();
  if (!user) return { error: unauthorized() } as const;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return { error: NextResponse.json({ error: "Listing not found" }, { status: 404 }) } as const;
  if (!canManageListing(user, listing)) return { error: forbidden() } as const;
  const image = await prisma.listingImage.findUnique({ where: { id: photoId } });
  if (!image || image.listingId !== id) {
    return { error: NextResponse.json({ error: "Photo not found" }, { status: 404 }) } as const;
  }
  return { image, user } as const;
}

// Removes a photo — the "change" half of upload/change. Deletes the Blob
// object, then compacts remaining positions so the cover slot (position 0)
// is never left empty while later photos exist.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  const { id, photoId } = await params;
  const result = await loadAuthorized(id, photoId);
  if ("error" in result) return result.error;

  await prisma.$transaction(async (tx) => {
    await tx.listingImage.delete({ where: { id: photoId } });
    const remaining = await tx.listingImage.findMany({ where: { listingId: id }, orderBy: { position: "asc" } });
    for (let i = 0; i < remaining.length; i += 1) {
      if (remaining[i].position !== i) {
        await tx.listingImage.update({ where: { id: remaining[i].id }, data: { position: i } });
      }
    }
    await enqueueOutbox(tx, {
      type: "blob.delete",
      aggregateId: photoId,
      eventKey: `listing-image:${photoId}:delete`,
      payload: { storageKey: result.image.storageKey },
    });
    await invalidatePublicationForImageChange(
      tx,
      id,
      result.user.id,
      "Project image deleted",
    );
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  return NextResponse.json({ ok: true });
}

// Promotes a photo to position 0 (the card/hero cover image) by swapping
// positions with whichever photo currently holds that slot.
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  const { id, photoId } = await params;
  const result = await loadAuthorized(id, photoId);
  if ("error" in result) return result.error;

  let body: { action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (body.action !== "set_cover") {
    return NextResponse.json({ error: "action must be set_cover" }, { status: 400 });
  }
  if (result.image.position !== 0) {
    await prisma.$transaction(async (tx) => {
      const current = await tx.listingImage.findUnique({ where: { id: photoId } });
      if (!current || current.listingId !== id || current.position === 0) return;
      const cover = await tx.listingImage.findFirst({ where: { listingId: id, position: 0 } });
      await tx.listingImage.update({ where: { id: photoId }, data: { position: -1 } });
      if (cover) await tx.listingImage.update({ where: { id: cover.id }, data: { position: current.position } });
      await tx.listingImage.update({ where: { id: photoId }, data: { position: 0 } });
      await invalidatePublicationForImageChange(
        tx,
        id,
        result.user.id,
        "Project cover image changed",
      );
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
  return NextResponse.json({ ok: true });
}
