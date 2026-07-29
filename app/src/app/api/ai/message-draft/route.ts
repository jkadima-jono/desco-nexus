import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { generateMessageDraft } from "@/lib/ai";
import { applyRateLimit, rejectUntrustedOrigin } from "@/lib/request-security";

export async function POST(req: Request) {
  const originError = rejectUntrustedOrigin(req);
  if (originError) return originError;
  const limited = await applyRateLimit(req, "ai-message-draft", 10, 60_000);
  if (limited) return limited;
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  let body: { threadId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.threadId) {
    return NextResponse.json({ error: "threadId required" }, { status: 400 });
  }
  const thread = await prisma.thread.findFirst({
    where: { id: body.threadId, ownerId: user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const { draft, source } = await generateMessageDraft(
    thread.name,
    thread.org,
    thread.messages.map((m) => ({ from: m.sender as "them" | "me" | "system", text: m.text }))
  );
  await prisma.aiGenerationLog.create({
    data: { userId: user.id, kind: "message_draft", source, threadId: thread.id },
  });
  return NextResponse.json({ ok: true, draft, source });
}
