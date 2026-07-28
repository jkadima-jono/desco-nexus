import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import ContractManager from "./ContractManager";

export const dynamic = "force-dynamic";

export default async function ContractsPage() {
  const admin = await getSessionUser();
  if (!admin) redirect("/login");
  if (admin.role !== "admin") redirect("/");
  const [organizations, plans, contracts] = await Promise.all([
    prisma.organization.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.plan.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    prisma.commercialContract.findMany({
      orderBy: { createdAt: "desc" },
      include: { organization: { select: { name: true } }, plan: { select: { name: true } } },
    }),
  ]);
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Organization contracts</h1>
      <p className="mb-6 mt-1 text-sm text-wgray">Approved contracts control organization entitlements. Values are recorded commercial terms, not invoices or collected revenue.</p>
      <ContractManager
        organizations={organizations}
        plans={plans}
        contracts={contracts.map((c) => ({ ...c, startsAt: c.startsAt?.toISOString() ?? null, endsAt: c.endsAt?.toISOString() ?? null }))}
      />
    </div>
  );
}
