import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Not permitted for your role" }, { status: 403 });

  const { id } = await params;
  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (body.status !== "new" && body.status !== "read") {
    return NextResponse.json({ error: "status must be new|read" }, { status: 400 });
  }
  const existing = await prisma.contactInquiry.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.contactInquiry.update({ where: { id }, data: { status: body.status } });
  return NextResponse.json({ ok: true, inquiry: updated });
}
