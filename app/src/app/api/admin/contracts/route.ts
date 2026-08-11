import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canReviewSubmissions, forbidden, unauthorized } from "@/lib/authz";
import { rejectUntrustedOrigin } from "@/lib/request-security";
import { boundedInteger, boundedString } from "@/lib/request-input";

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
  const orgId = boundedString(body.orgId, 100);
  const planId = boundedString(body.planId, 100);
  if (!orgId || !planId) {
    return NextResponse.json({ error: "Organization and package are required" }, { status: 400 });
  }
  const [organization, plan] = await Promise.all([
    prisma.organization.findUnique({ where: { id: orgId } }),
    prisma.plan.findUnique({ where: { id: planId } }),
  ]);
  if (!organization || !plan) {
    return NextResponse.json({ error: "Organization or package not found" }, { status: 404 });
  }
  const startsAt = typeof body.startsAt === "string" && body.startsAt ? new Date(body.startsAt) : null;
  const endsAt = typeof body.endsAt === "string" && body.endsAt ? new Date(body.endsAt) : null;
  if ((startsAt && Number.isNaN(startsAt.getTime())) || (endsAt && Number.isNaN(endsAt.getTime()))) {
    return NextResponse.json({ error: "Contract dates must be valid dates" }, { status: 400 });
  }
  if (startsAt && endsAt && endsAt < startsAt) {
    return NextResponse.json({ error: "Contract end date must not precede its start date" }, { status: 400 });
  }
  const currencyInput = boundedString(body.currency, 3).toUpperCase();
  const currency = /^[A-Z]{3}$/.test(currencyInput) ? currencyInput : "USD";
  const now = new Date().toISOString();
  const contract = await prisma.commercialContract.create({
    data: {
      orgId: organization.id,
      planId: plan.id,
      currency,
      annualValueMinor: boundedInteger(body.annualValueMinor, 0, 2_147_483_647),
      seatLimit: boundedInteger(body.seatLimit, 1, 1_000_000),
      serviceLevel: boundedString(body.serviceLevel, 500),
      dataRetentionDays: boundedInteger(body.dataRetentionDays, 1, 3650),
      termsVersion: boundedString(body.termsVersion, 80) || null,
      startsAt,
      endsAt,
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
  const id = boundedString(body.id, 100);
  const status = boundedString(body.status, 30);
  if (!id || !STATUSES.has(status)) {
    return NextResponse.json({ error: "Valid contract id and status are required" }, { status: 400 });
  }
  const note = boundedString(body.note, 500);
  if (!note) return NextResponse.json({ error: "A decision note is required" }, { status: 400 });
  const current = await prisma.commercialContract.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Contract not found" }, { status: 404 });
  const history = JSON.parse(current.history || "[]") as unknown[];
  history.push({ by: admin.fullName, action: `status:${status}`, note, at: new Date().toISOString() });
  const approved = status === "approved" || status === "active";
  const contract = await prisma.commercialContract.update({
    where: { id: current.id },
    data: {
      status,
      approvedBy: approved ? admin.fullName : current.approvedBy,
      approvedAt: approved ? new Date() : current.approvedAt,
      history: JSON.stringify(history),
    },
  });
  return NextResponse.json({ ok: true, contract });
}
