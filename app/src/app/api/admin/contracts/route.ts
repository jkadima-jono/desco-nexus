import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canReviewSubmissions, forbidden, unauthorized } from "@/lib/authz";
import { rejectUntrustedOrigin } from "@/lib/request-security";

const STATUSES = new Set(["draft", "approved", "active", "suspended", "expired", "cancelled"]);

export async function POST(req: Request) {
  const originError = rejectUntrustedOrigin(req);
  if (originError) return originError;
  const admin = await getSessionUser();
  if (!admin) return unauthorized();
  if (!canReviewSubmissions(admin)) return forbidden();

  let body: {
    orgId?: string;
    planId?: string;
    currency?: string;
    annualValueMinor?: number | null;
    seatLimit?: number | null;
    serviceLevel?: string;
    dataRetentionDays?: number | null;
    termsVersion?: string;
    startsAt?: string | null;
    endsAt?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.orgId || !body.planId) {
    return NextResponse.json({ error: "Organization and package are required" }, { status: 400 });
  }
  const [organization, plan] = await Promise.all([
    prisma.organization.findUnique({ where: { id: body.orgId } }),
    prisma.plan.findUnique({ where: { id: body.planId } }),
  ]);
  if (!organization || !plan) {
    return NextResponse.json({ error: "Organization or package not found" }, { status: 404 });
  }
  const now = new Date().toISOString();
  const contract = await prisma.commercialContract.create({
    data: {
      orgId: organization.id,
      planId: plan.id,
      currency: body.currency?.trim().toUpperCase().slice(0, 3) || "USD",
      annualValueMinor: typeof body.annualValueMinor === "number" ? Math.max(0, Math.round(body.annualValueMinor)) : null,
      seatLimit: typeof body.seatLimit === "number" ? Math.max(1, Math.round(body.seatLimit)) : null,
      serviceLevel: body.serviceLevel?.trim().slice(0, 500) || "",
      dataRetentionDays: typeof body.dataRetentionDays === "number" ? Math.max(1, Math.round(body.dataRetentionDays)) : null,
      termsVersion: body.termsVersion?.trim().slice(0, 80) || null,
      startsAt: body.startsAt ? new Date(body.startsAt) : null,
      endsAt: body.endsAt ? new Date(body.endsAt) : null,
      history: JSON.stringify([{ by: admin.fullName, action: "created", note: "Draft contract created", at: now }]),
    },
  });
  return NextResponse.json({ ok: true, contract });
}

export async function PATCH(req: Request) {
  const originError = rejectUntrustedOrigin(req);
  if (originError) return originError;
  const admin = await getSessionUser();
  if (!admin) return unauthorized();
  if (!canReviewSubmissions(admin)) return forbidden();

  let body: { id?: string; status?: string; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.id || !STATUSES.has(body.status ?? "")) {
    return NextResponse.json({ error: "Valid contract id and status are required" }, { status: 400 });
  }
  const note = body.note?.trim().slice(0, 500) ?? "";
  if (!note) return NextResponse.json({ error: "A decision note is required" }, { status: 400 });
  const current = await prisma.commercialContract.findUnique({ where: { id: body.id } });
  if (!current) return NextResponse.json({ error: "Contract not found" }, { status: 404 });
  const history = JSON.parse(current.history || "[]") as unknown[];
  history.push({ by: admin.fullName, action: `status:${body.status}`, note, at: new Date().toISOString() });
  const approved = body.status === "approved" || body.status === "active";
  const contract = await prisma.commercialContract.update({
    where: { id: current.id },
    data: {
      status: body.status,
      approvedBy: approved ? admin.fullName : current.approvedBy,
      approvedAt: approved ? new Date() : current.approvedAt,
      history: JSON.stringify(history),
    },
  });
  return NextResponse.json({ ok: true, contract });
}
