import { NextResponse } from "next/server";

type Bucket = { count: number; resetsAt: number };
const buckets = new Map<string, Bucket>();

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

export function applyRateLimit(
  req: Request,
  scope: string,
  limit: number,
  windowMs: number,
): NextResponse | null {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const client = forwarded || req.headers.get("x-real-ip") || "unknown";
  const key = `${scope}:${client}`;
  const now = Date.now();
  const current = buckets.get(key);
  const bucket = !current || current.resetsAt <= now
    ? { count: 1, resetsAt: now + windowMs }
    : { count: current.count + 1, resetsAt: current.resetsAt };
  buckets.set(key, bucket);

  if (buckets.size > 10_000) {
    for (const [bucketKey, value] of buckets) {
      if (value.resetsAt <= now) buckets.delete(bucketKey);
    }
  }
  if (bucket.count <= limit) return null;

  return NextResponse.json(
    { error: "Too many requests. Please retry later." },
    {
      status: 429,
      headers: { "Retry-After": String(Math.max(1, Math.ceil((bucket.resetsAt - now) / 1000))) },
    },
  );
}
