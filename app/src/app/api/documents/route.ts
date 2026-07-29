import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageListing, forbidden } from "@/lib/authz";

const MAX_BYTES = 20 * 1024 * 1024;
const ALLOWED_EXT = new Set([".pdf", ".xlsx", ".docx", ".pptx", ".png", ".jpg", ".jpeg", ".csv"]);
function fmtSize(n: number): string {
  return n >= 1024 * 1024
    ? (n / (1024 * 1024)).toFixed(1) + " MB"
    : Math.max(1, Math.round(n / 1024)) + " KB";
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "multipart/form-data required" }, { status: 400 });
  }
  const file = form.get("file");
  const listingId = String(form.get("listingId") ?? "");
  const folder = String(form.get("folder") ?? "5. Uploads").slice(0, 80);

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file field required" }, { status: 400 });
  }
  if (!listingId) {
    return NextResponse.json({ error: "listingId required" }, { status: 400 });
  }
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  if (!canManageListing(user, listing)) {
    return forbidden();
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be 1B–20MB" }, { status: 400 });
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json(
      { error: "Type not allowed: " + ext },
      { status: 400 }
    );
  }

  const storageKey = `documents/${listingId}/${crypto.randomUUID()}${ext}`;
  const blob = await put(storageKey, file, {
    access: "private",
    addRandomSuffix: false,
    contentType: file.type || "application/octet-stream",
  });

  const doc = await prisma.document.create({
    data: {
      listingId,
      // basename strips any client-supplied path segments
      name: path.basename(file.name).slice(0, 200),
      size: fmtSize(file.size),
      folder,
      storageKey: blob.pathname,
      mime: file.type || "application/octet-stream",
    },
  });
  return NextResponse.json({ ok: true, document: doc });
}
