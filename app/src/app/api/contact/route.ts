import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { applyRateLimit, rejectUntrustedOrigin } from "@/lib/request-security";
import {
  CONTACT_NOTICE_VERSION,
  CONTACT_RETENTION_DAYS,
} from "@/lib/legal-consent";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = new Set([
  "general",
  "investor-access",
  "project-submission",
  "data-room",
  "institutional-partnership",
  "commercial-model",
  "government-dfi",
  "inaccurate-information",
  "technical-support",
]);
const LOCALES = new Set(["en", "fr", "es", "pt", "zh"]);
const SALES_TOPICS = new Set([
  "investor-access",
  "project-submission",
  "data-room",
  "institutional-partnership",
  "commercial-model",
  "government-dfi",
]);

function bounded(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function contactTypeFor(topic: string) {
  if (topic === "project-submission") return "sponsor";
  if (topic === "government-dfi") return "government";
  if (topic === "institutional-partnership") return "partner";
  return "investor";
}

function splitName(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? name,
    lastName: parts.slice(1).join(" ") || "Not provided",
  };
}

export async function POST(req: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_PUBLIC_FORM_COLLECTION !== "true"
  ) {
    return NextResponse.json(
      { error: "Public form collection is paused pending approved privacy terms." },
      { status: 503 },
    );
  }
  const originError = rejectUntrustedOrigin(req);
  if (originError) return originError;
  const limited = await applyRateLimit(req, "contact", 8, 15 * 60_000);
  if (limited) return limited;
  let body: {
    name?: string;
    email?: string;
    organization?: string;
    topic?: string;
    message?: string;
    projectId?: string;
    locale?: string;
    sourcePath?: string;
    referrer?: string;
    campaignSource?: string;
    campaignMedium?: string;
    campaignName?: string;
    requestKey?: string;
    acknowledgedContactNotice?: boolean;
    contactNoticeVersion?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const organization = body.organization?.trim().slice(0, 150) || null;
  const topic = TOPICS.has(body.topic ?? "") ? body.topic! : "general";
  const message = body.message?.trim() ?? "";
  const locale = LOCALES.has(body.locale ?? "") ? body.locale! : "en";
  const sourcePath = bounded(body.sourcePath, 240);
  const referrer = bounded(body.referrer, 500) || null;
  const campaignSource = bounded(body.campaignSource, 120) || null;
  const campaignMedium = bounded(body.campaignMedium, 120) || null;
  const campaignName = bounded(body.campaignName, 120) || null;
  const requestedProjectId = bounded(body.projectId, 100);
  const requestKey = bounded(body.requestKey, 100);

  if (!name || name.length > 150) {
    return NextResponse.json({ error: "Name required (max 150 chars)" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!message || message.length > 4000) {
    return NextResponse.json({ error: "Message required (max 4000 chars)" }, { status: 400 });
  }
  if (
    body.acknowledgedContactNotice !== true ||
    body.contactNoticeVersion !== CONTACT_NOTICE_VERSION
  ) {
    return NextResponse.json(
      { error: "Please acknowledge the contact notice." },
      { status: 400 },
    );
  }
  if (!/^[a-zA-Z0-9_-]{16,100}$/.test(requestKey)) {
    return NextResponse.json({ error: "A valid request key is required." }, { status: 400 });
  }

  const existingRequest = await prisma.contactInquiry.findUnique({ where: { requestKey } });
  if (existingRequest) {
    return NextResponse.json({ ok: true, id: existingRequest.id, duplicate: true });
  }

  const administrators = await prisma.user.findMany({
    where: { role: "admin" },
    select: { id: true, fullName: true, email: true },
    orderBy: { fullName: "asc" },
  });
  const configuredOwnerEmail = process.env.CRM_INTAKE_OWNER_EMAIL?.trim().toLowerCase();
  const owner = (
    configuredOwnerEmail
      ? administrators.find((administrator) => administrator.email.toLowerCase() === configuredOwnerEmail)
      : null
  ) ?? administrators[0] ?? null;
  if (!owner) {
    return NextResponse.json(
      { error: "Inquiry intake is temporarily unavailable. Please use the published support address." },
      { status: 503 },
    );
  }

  const now = new Date();
  const retentionEndsAt = new Date(now);
  retentionEndsAt.setUTCDate(retentionEndsAt.getUTCDate() + CONTACT_RETENTION_DAYS);
  const { firstName, lastName } = splitName(name);

  try {
    const inquiry = await prisma.$transaction(async (tx) => {
      const listing = requestedProjectId
        ? await tx.listing.findUnique({ where: { id: requestedProjectId }, select: { id: true, title: true } })
        : null;

    let crmContact = await tx.crmContact.findFirst({
      where: { email },
      orderBy: { updatedAt: "desc" },
    });
    const sourceNote = [
      organization ? `Organization supplied: ${organization}` : "",
      `Latest public inquiry: ${topic.replaceAll("-", " ")}`,
    ].filter(Boolean).join("\n");
    if (crmContact) {
      crmContact = await tx.crmContact.update({
        where: { id: crmContact.id },
        data: {
          firstName,
          lastName,
          contactType: contactTypeFor(topic),
          source: "public-contact",
          ownerId: crmContact.ownerId ?? owner.id,
          notes: [crmContact.notes, sourceNote].filter(Boolean).join("\n").slice(0, 2000),
        },
      });
    } else {
      crmContact = await tx.crmContact.create({
        data: {
          firstName,
          lastName,
          email,
          contactType: contactTypeFor(topic),
          source: "public-contact",
          ownerId: owner.id,
          notes: sourceNote,
        },
      });
    }

    const opportunityName = `${topic.replaceAll("-", " ")} — ${organization || name}`.slice(0, 180);
    let opportunity = SALES_TOPICS.has(topic)
      ? await tx.crmOpportunity.findFirst({
          where: {
            contactId: crmContact.id,
            listingId: listing?.id ?? null,
            name: opportunityName,
            status: "open",
          },
          orderBy: { updatedAt: "desc" },
        })
      : null;
    if (SALES_TOPICS.has(topic) && !opportunity) {
      opportunity = await tx.crmOpportunity.create({
          data: {
            name: opportunityName,
            contactId: crmContact.id,
            listingId: listing?.id ?? null,
            ownerId: owner.id,
            stage: "identified",
            probability: 10,
            nextStep: "Qualify the inquiry and agree the appropriate access or commercial scope.",
            history: JSON.stringify([{
              by: "public contact form",
              action: "created",
              stage: "identified",
              at: now.toISOString(),
            }]),
          },
        });
    }

    const created = await tx.contactInquiry.create({
      data: {
        requestKey,
        name,
        email,
        organization,
        topic,
        message,
        locale,
        projectId: listing?.id ?? null,
        sourcePath: sourcePath.startsWith("/") ? sourcePath : "/contact",
        referrer,
        campaignSource,
        campaignMedium,
        campaignName,
        acknowledgedAt: now,
        contactNoticeVersion: CONTACT_NOTICE_VERSION,
        retentionEndsAt,
        crmContactId: crmContact.id,
        crmOpportunityId: opportunity?.id ?? null,
      },
    });

    await tx.crmActivity.create({
        data: {
          actorId: owner.id,
          contactId: crmContact.id,
          opportunityId: opportunity?.id ?? null,
          type: "inquiry",
          subject: `Public ${topic.replaceAll("-", " ")} inquiry`,
          body: `Inquiry ${created.id}; source ${sourcePath || "/contact"}; locale ${locale}.`,
          occurredAt: now,
        },
      });
    const taskTitle = `Respond to ${name}`;
    const existingTask = await tx.crmTask.findFirst({
      where: {
        title: taskTitle,
        contactId: crmContact.id,
        opportunityId: opportunity?.id ?? null,
        status: { in: ["open", "in-progress"] },
      },
    });
    if (!existingTask) {
      await tx.crmTask.create({
        data: {
          title: taskTitle,
          description: `Review inquiry ${created.id} and record the qualification outcome.`,
          priority: SALES_TOPICS.has(topic) ? "high" : "normal",
          dueAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          assigneeId: owner.id,
          createdById: owner.id,
          contactId: crmContact.id,
          opportunityId: opportunity?.id ?? null,
        },
      });
    }
    if (administrators.length > 0) {
      await tx.notification.createMany({
        data: administrators.map((administrator) => ({
          userId: administrator.id,
          type: "contact_inquiry",
          title: "New contact inquiry",
          body: `${name} submitted a ${topic.replaceAll("-", " ")} inquiry.`,
          link: "/admin/inquiries",
        })),
      });
    }
      return created;
    });
    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const duplicate = await prisma.contactInquiry.findUnique({ where: { requestKey } });
      if (duplicate) return NextResponse.json({ ok: true, id: duplicate.id, duplicate: true });
    }
    throw error;
  }
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Not permitted for your role" }, { status: 403 });
  }
  const inquiries = await prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ inquiries });
}
