import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";

const PHOTO_DIR = path.join(process.cwd(), "uploads", "photos");
const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const image = await prisma.listingImage.findUnique({ where: { id } });
  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const filePath = path.resolve(PHOTO_DIR, image.storageKey);
  if (!filePath.startsWith(PHOTO_DIR + path.sep)) {
    return NextResponse.json({ error: "Invalid image" }, { status: 400 });
  }
  try {
    const data = await readFile(filePath);
    const ext = path.extname(image.storageKey).toLowerCase();
    return new NextResponse(data, {
      headers: {
        "Content-Type": MIME[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }
}
