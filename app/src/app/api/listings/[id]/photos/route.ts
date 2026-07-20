import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageListing, forbidden } from "@/lib/authz";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const PHOTO_DIR = path.join(process.cwd(), "uploads", "photos");

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
  const caption = String(form?.get("caption") ?? "").slice(0, 200) || null;
  const storageKey = crypto.randomUUID() + ext;
  await mkdir(PHOTO_DIR, { recursive: true });
  await writeFile(
    path.join(PHOTO_DIR, storageKey),
    Buffer.from(await file.arrayBuffer())
  );
  const count = await prisma.listingImage.count({ where: { listingId: id } });
  const image = await prisma.listingImage.create({
    data: { listingId: id, storageKey, caption, position: count },
  });
  return NextResponse.json({ ok: true, image });
}
