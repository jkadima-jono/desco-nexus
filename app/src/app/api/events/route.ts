import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { applyRateLimit, rejectUntrustedOrigin } from "@/lib/request-security";

const EVENTS = new Set([
  "page_view",
  "contact_submitted",
  "opportunity_viewed",
  "evidence_opened",
  "comparison_started",
  "information_requested",
  "data_room_requested",
  "mandate_created",
  "submission_started",
  "submission_completed",
]);

export async function POST(req: Request) {
  const originError = rejectUntrustedOrigin(req);
  if (originError) return originError;
  const limited = await applyRateLimit(req, "product-event", 120, 60_000);
  if (limited) return limited;

  let body: { event?: string; path?: string; context?: Record<string, string | number | boolean> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!EVENTS.has(body.event ?? "")) {
    return NextResponse.json({ error: "Unsupported event" }, { status: 400 });
  }
  const path = body.path?.startsWith("/") ? body.path.slice(0, 240) : "/";
  const context = Object.fromEntries(
    Object.entries(body.context ?? {})
      .filter(([key, value]) => key.length <= 40 && ["string", "number", "boolean"].includes(typeof value))
      .slice(0, 10)
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 120) : value]),
  );
  await prisma.productEvent.create({
    data: { event: body.event!, path, context: JSON.stringify(context) },
  });
  return new NextResponse(null, { status: 204 });
}
