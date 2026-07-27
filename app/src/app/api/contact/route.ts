import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = new Set([
  "general",
  "investor-access",
  "project-submission",
  "data-room",
  "institutional-partnership",
  "government-dfi",
  "inaccurate-information",
  "technical-support",
]);

export async function POST(req: Request) {
  let body: { name?: string; email?: string; organization?: string; topic?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const organization = body.organization?.trim().slice(0, 150) || null;
  const topic = TOPICS.has(body.topic ?? "") ? body.topic! : "general";
  const message = body.message?.trim() ?? "";

  if (!name || name.length > 150) {
    return NextResponse.json({ error: "Name required (max 150 chars)" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!message || message.length > 4000) {
    return NextResponse.json({ error: "Message required (max 4000 chars)" }, { status: 400 });
  }

  const inquiry = await prisma.contactInquiry.create({
    data: { name, email, organization, topic, message },
  });
  return NextResponse.json({ ok: true, id: inquiry.id });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Not permitted for your role" }, { status: 403 });
  }
  const inquiries = await prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ inquiries });
}
