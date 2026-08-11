import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { rejectUntrustedOrigin } from "@/lib/request-security";
import { boundedString } from "@/lib/request-input";

const RESULTS = new Set(["clean", "infected", "error"]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const originError = rejectUntrustedOrigin(req);
  if (originError) return originError;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
  let body: { result?: string; providerRef?: string; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!RESULTS.has(body.result ?? "")) {
    return NextResponse.json({ error: "result must be clean|infected|error" }, { status: 400 });
  }
  const providerRef = boundedString(body.providerRef, 200);
  const note = boundedString(body.note, 1000);
  if (!providerRef || !note) {
    return NextResponse.json({ error: "Scanner reference and review note are required" }, { status: 400 });
  }
  const { id } = await params;
  const existing = await prisma.document.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  const document = await prisma.document.update({
    where: { id },
    data: {
      scanStatus: body.result,
      scanProviderRef: providerRef,
      scanCheckedAt: new Date(),
      scanNote: note,
      lifecycle: body.result === "clean" ? "uploaded" : "rejected",
    },
  });
  return NextResponse.json({ ok: true, document });
}
