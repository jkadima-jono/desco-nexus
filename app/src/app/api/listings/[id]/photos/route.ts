import { NextResponse } from "next/server";
import { del, put } from "@vercel/blob";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageListing, forbidden } from "@/lib/authz";
import { Prisma } from "@prisma/client";
import { invalidatePublicationForImageChange } from "@/lib/invalidate-publication";
import { hasValidImageSignature } from "@/lib/image-upload";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  if (!canManageListing(user, listing)) {
    return forbidden();
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file field required" }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 1B–10MB" }, { status: 400 });
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED.has(ext)) {
    return NextResponse.json(
      { error: "Only jpg, png, webp allowed" },
      { status: 400 }
    );
  }
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!hasValidImageSignature(ext, file.type, header)) {
    return NextResponse.json(
      { error: "File content does not match an allowed image format" },
      { status: 400 },
    );
  }
  const caption = String(form?.get("caption") ?? "").slice(0, 200) || null;
  const pathname = "listings/" + id + "/" + crypto.randomUUID() + ext;
  const blob = await put(pathname, file, { access: "public" });
  try {
    const image = await prisma.$transaction(async (tx) => {
      const last = await tx.listingImage.findFirst({
        where: { listingId: id },
        orderBy: { position: "desc" },
        select: { position: true },
      });
      const image = await tx.listingImage.create({
        data: { listingId: id, storageKey: blob.url, caption, position: (last?.position ?? -1) + 1 },
      });
      await invalidatePublicationForImageChange(
        tx,
        id,
        user.id,
        "Project image uploaded",
      );
      return image;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return NextResponse.json({ ok: true, image });
  } catch (error) {
    await del(blob.url).catch(() => undefined);
    throw error;
  }
}
