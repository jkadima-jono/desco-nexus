import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }
  if (!doc.storageKey) {
    return NextResponse.json(
      { error: "Demo document — no file attached" },
      { status: 404 }
    );
  }
  // storageKey is server-generated (UUID+ext); resolve + prefix check blocks traversal
  const filePath = path.resolve(UPLOAD_DIR, doc.storageKey);
  if (!filePath.startsWith(UPLOAD_DIR + path.sep)) {
    return NextResponse.json({ error: "Invalid document" }, { status: 400 });
  }
  try {
    const data = await readFile(filePath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": doc.mime ?? "application/octet-stream",
        "Content-Disposition":
          'attachment; filename="' + doc.name.replace(/"/g, "") + '"',
      },
    });
  } catch {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }
}
