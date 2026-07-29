import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canReviewSubmissions, forbidden, unauthorized } from "@/lib/authz";
import { rejectUntrustedOrigin } from "@/lib/request-security";

const CONTACT_TYPES = new Set(["investor", "sponsor", "advisor", "government", "partner", "other"]);
const CONTACT_STATUSES = new Set(["lead", "qualified", "active", "inactive"]);
const OPPORTUNITY_STAGES = new Set(["identified", "qualified", "nda", "diligence", "term-sheet", "committed", "won", "lost"]);
const TASK_STATUSES = new Set(["open", "in-progress", "completed", "cancelled"]);

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) return { error: unauthorized() };
  if (!canReviewSubmissions(user)) return { error: forbidden() };
  return { user };
}

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optionalId(value: unknown) {
  return text(value, 100) || null;
}

async function validateReferences({
  organizationId,
  contactId,
  listingId,
  opportunityId,
}: {
  organizationId?: string | null;
  contactId?: string | null;
  listingId?: string | null;
  opportunityId?: string | null;
}) {
  const [organization, contact, listing, opportunity] = await Promise.all([
    organizationId ? prisma.organization.findUnique({ where: { id: organizationId }, select: { id: true } }) : null,
    contactId ? prisma.crmContact.findUnique({ where: { id: contactId }, select: { id: true } }) : null,
    listingId ? prisma.listing.findUnique({ where: { id: listingId }, select: { id: true } }) : null,
    opportunityId ? prisma.crmOpportunity.findUnique({ where: { id: opportunityId }, select: { id: true } }) : null,
  ]);

  if (organizationId && !organization) return "Organization not found";
  if (contactId && !contact) return "Contact not found";
  if (listingId && !listing) return "Project not found";
  if (opportunityId && !opportunity) return "Opportunity not found";
  return null;
}

export async function POST(req: Request) {
  const originError = rejectUntrustedOrigin(req);
  if (originError) return originError;
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.entity === "contact") {
    const firstName = text(body.firstName, 100);
    const lastName = text(body.lastName, 100);
    const contactType = text(body.contactType, 30) || "investor";
    if (!firstName || !lastName || !CONTACT_TYPES.has(contactType)) {
      return NextResponse.json({ error: "First name, last name and a valid contact type are required" }, { status: 400 });
    }
    const organizationId = optionalId(body.organizationId);
    const referenceError = await validateReferences({ organizationId });
    if (referenceError) return NextResponse.json({ error: referenceError }, { status: 400 });
    const contact = await prisma.crmContact.create({
      data: {
        firstName,
        lastName,
        email: text(body.email, 254).toLowerCase() || null,
        phone: text(body.phone, 60) || null,
        title: text(body.title, 120) || null,
        contactType,
        source: text(body.source, 80) || "manual",
        notes: text(body.notes, 2000),
        organizationId,
        ownerId: auth.user.id,
      },
    });
    return NextResponse.json({ ok: true, contact });
  }

  if (body.entity === "opportunity") {
    const name = text(body.name, 180);
    const stage = text(body.stage, 30) || "identified";
    if (!name || !OPPORTUNITY_STAGES.has(stage)) {
      return NextResponse.json({ error: "Opportunity name and a valid stage are required" }, { status: 400 });
    }
    const valueUsd = text(body.valueUsd, 40);
    if (valueUsd && !/^\d{1,15}(\.\d{1,2})?$/.test(valueUsd)) {
      return NextResponse.json({ error: "Opportunity value must be a positive amount with no more than two decimals" }, { status: 400 });
    }
    const probability = Math.min(100, Math.max(0, Number(body.probability) || 10));
    const contactId = optionalId(body.contactId);
    const organizationId = optionalId(body.organizationId);
    const listingId = optionalId(body.listingId);
    const referenceError = await validateReferences({ contactId, organizationId, listingId });
    if (referenceError) return NextResponse.json({ error: referenceError }, { status: 400 });
    const opportunity = await prisma.crmOpportunity.create({
      data: {
        name,
        stage,
        probability,
        valueUsd: valueUsd || null,
        currency: text(body.currency, 3).toUpperCase() || "USD",
        nextStep: text(body.nextStep, 500),
        contactId,
        organizationId,
        listingId,
        ownerId: auth.user.id,
        history: JSON.stringify([{ by: auth.user.fullName, action: "created", stage, at: new Date().toISOString() }]),
      },
    });
    return NextResponse.json({ ok: true, opportunity });
  }

  if (body.entity === "task") {
    const title = text(body.title, 180);
    if (!title) return NextResponse.json({ error: "Task title is required" }, { status: 400 });
    const due = text(body.dueAt, 40);
    const dueAt = due ? new Date(due) : null;
    if (dueAt && Number.isNaN(dueAt.getTime())) {
      return NextResponse.json({ error: "Task due date is invalid" }, { status: 400 });
    }
    const contactId = optionalId(body.contactId);
    const opportunityId = optionalId(body.opportunityId);
    const referenceError = await validateReferences({ contactId, opportunityId });
    if (referenceError) return NextResponse.json({ error: referenceError }, { status: 400 });
    const task = await prisma.crmTask.create({
      data: {
        title,
        description: text(body.description, 1000),
        priority: text(body.priority, 20) || "normal",
        dueAt,
        assigneeId: auth.user.id,
        createdById: auth.user.id,
        contactId,
        opportunityId,
      },
    });
    return NextResponse.json({ ok: true, task });
  }

  if (body.entity === "activity") {
    const subject = text(body.subject, 180);
    if (!subject) return NextResponse.json({ error: "Activity subject is required" }, { status: 400 });
    const contactId = optionalId(body.contactId);
    const opportunityId = optionalId(body.opportunityId);
    const referenceError = await validateReferences({ contactId, opportunityId });
    if (referenceError) return NextResponse.json({ error: referenceError }, { status: 400 });
    const activity = await prisma.crmActivity.create({
      data: {
        subject,
        body: text(body.body, 3000),
        type: text(body.type, 30) || "note",
        actorId: auth.user.id,
        contactId,
        opportunityId,
      },
    });
    return NextResponse.json({ ok: true, activity });
  }

  return NextResponse.json({ error: "Unknown CRM entity" }, { status: 400 });
}

export async function PATCH(req: Request) {
  const originError = rejectUntrustedOrigin(req);
  if (originError) return originError;
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const id = text(body.id, 100);
  if (!id) return NextResponse.json({ error: "Record id is required" }, { status: 400 });

  if (body.entity === "contact") {
    const status = text(body.status, 30);
    if (!CONTACT_STATUSES.has(status)) return NextResponse.json({ error: "Invalid contact status" }, { status: 400 });
    const contact = await prisma.crmContact.update({ where: { id }, data: { status } });
    return NextResponse.json({ ok: true, contact });
  }

  if (body.entity === "opportunity") {
    const stage = text(body.stage, 30);
    if (!OPPORTUNITY_STAGES.has(stage)) return NextResponse.json({ error: "Invalid opportunity stage" }, { status: 400 });
    const current = await prisma.crmOpportunity.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    const history = JSON.parse(current.history || "[]") as unknown[];
    history.push({ by: auth.user.fullName, action: "stage-change", from: current.stage, to: stage, at: new Date().toISOString() });
    const opportunity = await prisma.crmOpportunity.update({
      where: { id },
      data: { stage, status: stage === "won" || stage === "lost" ? stage : "open", history: JSON.stringify(history) },
    });
    return NextResponse.json({ ok: true, opportunity });
  }

  if (body.entity === "task") {
    const status = text(body.status, 30);
    if (!TASK_STATUSES.has(status)) return NextResponse.json({ error: "Invalid task status" }, { status: 400 });
    const task = await prisma.crmTask.update({
      where: { id },
      data: { status, completedAt: status === "completed" ? new Date() : null },
    });
    return NextResponse.json({ ok: true, task });
  }

  return NextResponse.json({ error: "Unknown CRM entity" }, { status: 400 });
}
