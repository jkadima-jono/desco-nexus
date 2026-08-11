import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { applyRateLimit, rejectUntrustedOrigin } from "@/lib/request-security";
import { boundedString } from "@/lib/request-input";

export async function POST(req: Request) {
  const originError = rejectUntrustedOrigin(req);
  if (originError) return originError;
  const limited = await applyRateLimit(req, "message", 30, 60_000);
  if (limited) return limited;
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  let body: { threadId?: string; text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const threadId = boundedString(body.threadId, 100);
  const trimmed = boundedString(body.text, 4001);
  if (!threadId || !trimmed) {
    return NextResponse.json(
      { error: "threadId and non-empty text required" },
      { status: 400 }
    );
  }
  if (trimmed.length > 4000) {
    return NextResponse.json({ error: "Message too long (max 4000)" }, { status: 400 });
  }

  const thread = await prisma.thread.findFirst({ where: { id: threadId, ownerId: user.id } });
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: { threadId, sender: "me", text: trimmed },
  });
  return NextResponse.json({ ok: true, message });
}
