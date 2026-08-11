import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageListing, forbidden } from "@/lib/authz";
import { applyRateLimit, rejectUntrustedOrigin } from "@/lib/request-security";
import { documentMimeForExtension, safeDocumentName } from "@/lib/document-upload";
import { boundedString } from "@/lib/request-input";

const MAX_BYTES = 20 * 1024 * 1024;
const ALLOWED_EXT = new Set([".pdf", ".xlsx", ".docx", ".pptx", ".png", ".jpg", ".jpeg", ".csv", ".txt"]);
function fmtSize(n: number): string {
  return n >= 1024 * 1024
    ? (n / (1024 * 1024)).toFixed(1) + " MB"
    : Math.max(1, Math.round(n / 1024)) + " KB";
}

function signatureMatches(ext: string, bytes: Buffer) {
  if (ext === ".pdf") return bytes.subarray(0, 5).equals(Buffer.from("%PDF-"));
  if ([".docx", ".pptx", ".xlsx"].includes(ext)) return bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (ext === ".png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if ([".jpg", ".jpeg"].includes(ext)) return bytes[0] === 0xff && bytes[1] === 0xd8;
  return true;
}

export async function POST(req: Request) {
  const originRejection = rejectUntrustedOrigin(req);
  if (originRejection) return originRejection;
  const limited = await applyRateLimit(req, "document-upload", 12, 60 * 60_000);
  if (limited) return limited;
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (
    process.env.CONFIDENTIAL_UPLOADS_ENABLED !== "true" ||
    !process.env.DOCUMENT_SCANNER_PROVIDER?.trim()
  ) {
    return NextResponse.json(
      { error: "Confidential uploads are unavailable until an approved malware-scanning service is configured." },
      { status: 503 },
    );
  }

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "multipart/form-data required" }, { status: 400 });
  }
  const file = form.get("file");
  const listingId = boundedString(form.get("listingId"), 100);
  const folder = boundedString(form.get("folder"), 80) || "5. Uploads";

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

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!signatureMatches(ext, bytes)) {
    return NextResponse.json({ error: "File content does not match its extension" }, { status: 400 });
  }
  const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  const duplicate = await prisma.document.findFirst({
    where: { listingId, sha256, blobUploadedAt: { not: null }, lifecycle: { not: "archived" } },
  });
  if (duplicate) {
    return NextResponse.json(
      { error: "This file is already attached to the project", documentId: duplicate.id },
      { status: 409 },
    );
  }

  const storageKey = `documents/${listingId}/${crypto.randomUUID()}${ext}`;
  const name = safeDocumentName(file.name, ext);
  const mime = documentMimeForExtension(ext);
  const doc = await prisma.document.create({
    data: {
      listingId,
      // basename strips any client-supplied path segments
      name,
      originalName: name,
      size: fmtSize(file.size),
      folder,
      storageKey,
      mime,
      visibility: "restricted",
      lifecycle: "quarantined",
      sha256,
      scanStatus: "pending",
      reviewNote: "Uploaded to quarantine; malware scan, approval and evidence classification are pending.",
    },
  });
  try {
    const blob = await put(storageKey, bytes, {
      access: "private",
      addRandomSuffix: false,
      contentType: mime,
    });
    const uploaded = await prisma.document.update({
      where: { id: doc.id },
      data: { storageKey: blob.pathname, blobUploadedAt: new Date() },
    });
    return NextResponse.json({ ok: true, document: uploaded }, { status: 202 });
  } catch {
    await prisma.document.update({
      where: { id: doc.id },
      data: {
        lifecycle: "quarantined",
        scanStatus: "error",
        scanNote: "Upload completion was not confirmed. Maintenance reconciliation is required.",
      },
    }).catch(() => undefined);
    return NextResponse.json({ error: "Upload could not be completed." }, { status: 503 });
  }
}
