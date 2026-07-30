import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { hasDataRoomAccess } from "@/lib/dataroom";
import { canManageListing, forbidden } from "@/lib/authz";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id }, include: { listing: true } });
  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }
  // Being signed in is not enough — confidential documents require the
  // listing's own org, admin, or an explicit DataRoomAccess grant. This
  // replaces a prior gap where any authenticated user could download any
  // listing's confidential documents.
  const manager = canManageListing(user, doc.listing);
  if (doc.visibility === "internal" && !manager) {
    return forbidden();
  }
  if (doc.lifecycle !== "approved" && !manager) {
    return forbidden();
  }
  if (!manager && !(await hasDataRoomAccess(user, doc.listing))) {
    return forbidden();
  }
  if (!doc.storageKey) {
    return NextResponse.json(
      { error: "Demo document — no file attached" },
      { status: 404 }
    );
  }
  try {
    const blob = await get(doc.storageKey, { access: "private" });
    if (!blob) return NextResponse.json({ error: "File unavailable" }, { status: 404 });
    await prisma.documentAccessLog.create({ data: { documentId: doc.id, userId: user.id } });
    return new NextResponse(blob.stream, {
      headers: {
        "Content-Type": doc.mime ?? "application/octet-stream",
        "Content-Disposition":
          'attachment; filename="' + doc.name.replace(/"/g, "") + '"',
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }
}
