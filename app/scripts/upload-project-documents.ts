import { createHash, randomUUID } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { prisma } from "../src/lib/db";
import { projectDocumentSources } from "../src/lib/project-documents";

const MAX_BYTES = 20 * 1024 * 1024;
const sourceRoots = {
  desco_archive: process.env.DESCO_SOURCE_ROOT,
  google_drive: process.env.DESCO_DRIVE_ROOT,
};

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function contentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      ".pdf": "application/pdf",
      ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".txt": "text/plain",
    }[ext] ?? "application/octet-stream"
  );
}

async function main() {
  if (!sourceRoots.desco_archive || !sourceRoots.google_drive) {
    throw new Error("DESCO_SOURCE_ROOT and DESCO_DRIVE_ROOT are required. No files were uploaded.");
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required. No files were uploaded.");
  }

  let uploaded = 0;
  let skipped = 0;
  const seen = new Map<string, string>();

  for (const source of projectDocumentSources) {
    const sourceRoot = sourceRoots[source.sourceLibrary ?? "desco_archive"];
    if (!sourceRoot) {
      throw new Error(`Source root is not configured for ${source.sourceLibrary ?? "desco_archive"}.`);
    }
    const absolutePath = path.join(sourceRoot, source.sourceRef);
    let fileStat;
    try {
      fileStat = await stat(absolutePath);
    } catch {
      console.warn(`Missing source: ${source.sourceRef}`);
      skipped += 1;
      continue;
    }
    if (!fileStat.isFile() || fileStat.size === 0 || fileStat.size > MAX_BYTES) {
      console.warn(`Skipped size limit: ${source.sourceRef} (${formatSize(fileStat.size)})`);
      skipped += 1;
      continue;
    }

    const bytes = await readFile(absolutePath);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    let storageKey = seen.get(sha256);
    if (!storageKey) {
      const ext = path.extname(absolutePath).toLowerCase();
      const requestedKey = `documents/${source.listingId}/${randomUUID()}${ext}`;
      const blob = await put(requestedKey, bytes, {
        access: "private",
        addRandomSuffix: false,
        contentType: contentType(absolutePath),
      });
      storageKey = blob.pathname;
      seen.set(sha256, storageKey);
    }

    const existingDocument = await prisma.document.findFirst({
      where: { listingId: source.listingId, sourceRef: source.sourceRef },
      select: { id: true },
    });
    const uploadedData = {
        storageKey,
        sha256,
        size: formatSize(fileStat.size),
        mime: contentType(absolutePath),
        lifecycle: "reviewed",
        approvedAt: null,
        approvedBy: null,
    };
    if (existingDocument) {
      await prisma.document.update({
        where: { id: existingDocument.id },
        data: uploadedData,
      });
    } else {
      await prisma.document.create({
        data: {
        listingId: source.listingId,
        sourceRef: source.sourceRef,
        name: source.name,
        originalName: path.basename(absolutePath),
        size: formatSize(fileStat.size),
        folder: source.folder,
        storageKey,
        mime: contentType(absolutePath),
        visibility: source.visibility,
        lifecycle: "reviewed",
        documentType: source.documentType,
        evidenceCategory: source.evidenceCategory,
        issuer: source.issuer,
        sourceDate: source.sourceDate ? new Date(`${source.sourceDate}T00:00:00.000Z`) : null,
        version: source.version,
        language: source.language ?? "en",
        sha256,
        reviewNote: source.reviewNote,
        },
      });
    }
    uploaded += 1;
    console.log(`Uploaded ${source.listingId}: ${source.name}`);
  }

  console.log(`Project source upload complete: ${uploaded} attached, ${skipped} skipped.`);
}

main()
  .finally(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
