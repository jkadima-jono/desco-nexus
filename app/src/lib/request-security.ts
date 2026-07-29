import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "./db";

export function rejectUntrustedOrigin(req: Request): NextResponse | null {
  const origin = req.headers.get("origin");
  if (!origin) return null;
  try {
    if (new URL(origin).host === new URL(req.url).host) return null;
  } catch {
    // Invalid origins are rejected below.
  }
  return NextResponse.json({ error: "Untrusted request origin" }, { status: 403 });
}

export async function applyRateLimit(
  req: Request,
  scope: string,
  limit: number,
  windowMs: number,
): Promise<NextResponse | null> {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const client = forwarded || req.headers.get("x-real-ip") || "unknown";
  const key = crypto.createHash("sha256").update(`${scope}:${client}`).digest("hex");
  const now = Date.now();
  const bucket = await prisma.$transaction(async (tx) => {
    const current = await tx.rateLimitBucket.findUnique({ where: { key } });
    if (!current || current.resetsAt.getTime() <= now) {
      return tx.rateLimitBucket.upsert({
        where: { key },
        update: { count: 1, resetsAt: new Date(now + windowMs) },
        create: { key, count: 1, resetsAt: new Date(now + windowMs) },
      });
    }
    return tx.rateLimitBucket.update({ where: { key }, data: { count: { increment: 1 } } });
  });
  if (bucket.count <= limit) return null;

  return NextResponse.json(
    { error: "Too many requests. Please retry later." },
    {
      status: 429,
      headers: { "Retry-After": String(Math.max(1, Math.ceil((bucket.resetsAt.getTime() - now) / 1000))) },
    },
  );
}
