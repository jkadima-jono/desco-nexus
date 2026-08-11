import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { applyRateLimit, rejectUntrustedOrigin } from "@/lib/request-security";
import { sanitizeProductEventContext, sanitizeProductEventPath } from "@/lib/product-analytics";

const EVENTS = new Set([
  "page_view",
  "contact_started",
  "contact_submitted",
  "contact_error",
  "access_requested",
  "inquiry_triaged",
  "inquiry_qualified",
  "inquiry_converted",
  "inquiry_closed",
  "opportunity_viewed",
  "evidence_opened",
  "comparison_started",
  "information_requested",
  "data_room_requested",
  "mandate_created",
  "submission_started",
  "submission_completed",
  "account_started",
  "email_verification_requested",
  "email_verified",
  "profile_completed",
  "institutional_access_requested",
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
  const path = sanitizeProductEventPath(body.path);
  const context = sanitizeProductEventContext(body.context);
  await prisma.productEvent.create({
    data: { event: body.event!, path, context: JSON.stringify(context) },
  });
  return new NextResponse(null, { status: 204 });
}
