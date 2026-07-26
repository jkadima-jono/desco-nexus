import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageListing, unauthorized, forbidden } from "@/lib/authz";

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
  return { image } as const;
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

  await del(result.image.storageKey).catch(() => {});
  await prisma.listingImage.delete({ where: { id: photoId } });

  const remaining = await prisma.listingImage.findMany({
    where: { listingId: id },
    orderBy: { position: "asc" },
  });
  await Promise.all(
    remaining.map((img, i) =>
      img.position === i ? null : prisma.listingImage.update({ where: { id: img.id }, data: { position: i } })
    )
  );
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
    const cover = await prisma.listingImage.findFirst({ where: { listingId: id, position: 0 } });
    if (cover) {
      await prisma.listingImage.update({ where: { id: cover.id }, data: { position: result.image.position } });
    }
    await prisma.listingImage.update({ where: { id: photoId }, data: { position: 0 } });
  }
  return NextResponse.json({ ok: true });
}
