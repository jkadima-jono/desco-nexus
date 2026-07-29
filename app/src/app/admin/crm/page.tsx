import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CrmManager from "./CrmManager";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const admin = await getSessionUser();
  if (!admin) redirect("/login");
  if (admin.role !== "admin") redirect("/");

  const [contacts, opportunities, tasks, activities, organizations, listings] = await Promise.all([
    prisma.crmContact.findMany({ include: { organization: { select: { name: true } } }, orderBy: { updatedAt: "desc" }, take: 100 }),
    prisma.crmOpportunity.findMany({ include: { contact: true, listing: { select: { title: true } } }, orderBy: { updatedAt: "desc" }, take: 100 }),
    prisma.crmTask.findMany({ include: { opportunity: { select: { name: true } } }, orderBy: [{ status: "asc" }, { dueAt: "asc" }], take: 100 }),
    prisma.crmActivity.findMany({ include: { contact: { select: { firstName: true, lastName: true } }, opportunity: { select: { name: true } } }, orderBy: { occurredAt: "desc" }, take: 50 }),
    prisma.organization.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.listing.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Relationship CRM</h1>
      <p className="mb-6 mt-1 max-w-3xl text-sm text-wgray">Manage investor, sponsor, adviser and public-sector relationships, opportunity stages and follow-up actions. CRM contacts remain separate from platform user accounts.</p>
      <CrmManager
        contacts={contacts}
        opportunities={opportunities.map((opportunity) => ({
          ...opportunity,
          valueUsd: opportunity.valueUsd?.toString() ?? null,
        }))}
        tasks={tasks.map((task) => ({ ...task, dueAt: task.dueAt?.toISOString() ?? null }))}
        activities={activities.map((activity) => ({ ...activity, occurredAt: activity.occurredAt.toISOString() }))}
        organizations={organizations}
        listings={listings}
      />
    </main>
  );
}
