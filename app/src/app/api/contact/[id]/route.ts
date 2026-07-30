import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { rejectUntrustedOrigin } from "@/lib/request-security";

const STATUSES = new Set(["new", "read", "triaged", "qualified", "converted", "closed", "spam"]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const originError = rejectUntrustedOrigin(req);
  if (originError) return originError;
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
  if (!STATUSES.has(body.status ?? "")) {
    return NextResponse.json({ error: "Invalid inquiry status" }, { status: 400 });
  }
  const existing = await prisma.contactInquiry.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.$transaction(async (tx) => {
    const inquiry = await tx.contactInquiry.update({ where: { id }, data: { status: body.status } });
    if (inquiry.crmContactId && (body.status === "qualified" || body.status === "converted")) {
      await tx.crmContact.update({
        where: { id: inquiry.crmContactId },
        data: { status: body.status === "qualified" ? "qualified" : "active" },
      });
    }
    if (inquiry.crmOpportunityId && body.status === "qualified") {
      const opportunity = await tx.crmOpportunity.findUnique({ where: { id: inquiry.crmOpportunityId } });
      if (opportunity && opportunity.status === "open" && opportunity.stage === "identified") {
        const history = JSON.parse(opportunity.history || "[]") as unknown[];
        history.push({ by: user.fullName, action: "inquiry-qualified", from: "identified", to: "qualified", at: new Date().toISOString() });
        await tx.crmOpportunity.update({
          where: { id: opportunity.id },
          data: { stage: "qualified", probability: Math.max(opportunity.probability, 25), history: JSON.stringify(history) },
        });
      }
    }
    await tx.crmActivity.create({
      data: {
        actorId: user.id,
        contactId: inquiry.crmContactId,
        opportunityId: inquiry.crmOpportunityId,
        type: "inquiry-status",
        subject: `Inquiry marked ${body.status}`,
        body: `Inquiry ${inquiry.id} changed from ${existing.status} to ${body.status}.`,
      },
    });
    await tx.productEvent.create({
      data: {
        event: `inquiry_${body.status}`,
        path: "/admin/inquiries",
        context: JSON.stringify({ topic: inquiry.topic, locale: inquiry.locale }),
      },
    });
    return inquiry;
  });
  return NextResponse.json({ ok: true, inquiry: updated });
}
