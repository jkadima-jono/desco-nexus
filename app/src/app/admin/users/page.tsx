import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import UserPlanRow from "./UserPlanRow";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
  const admin = await getSessionUser();
  if (!admin) redirect("/login");
  if (admin.role !== "admin") redirect("/");

  const [users, plans] = await Promise.all([
    prisma.user.findMany({ include: { plan: true }, orderBy: { fullName: "asc" } }),
    prisma.plan.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const mrr = users.reduce((sum, u) => sum + (u.plan?.priceUsdPerMonth ?? 0), 0);
  const byPlan = plans.map((p) => ({ plan: p, count: users.filter((u) => u.planId === p.id).length }));
  const freeCount = users.length - byPlan.reduce((s, b) => s + b.count, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight">Commercial model simulation</h1>
      <p className="text-wgray text-sm mt-1 mb-2">
        No payment processor, invoice ledger or contract record is connected. These assignments test entitlement limits only.
        The value below is an internal scenario aggregate, not MRR, ARR, contracted value, invoiced value or collected revenue.
      </p>

      <div className="bg-white  p-5  mb-6 flex flex-wrap gap-6">
        <div>
          <div className="font-display font-extrabold text-2xl text-gold">${mrr.toLocaleString()}</div>
          <div className="text-[11px] text-wgray uppercase tracking-wider font-bold">Assigned monthly scenario value</div>
        </div>
        {byPlan.map(({ plan, count }) => (
          <div key={plan.id}>
            <div className="font-display font-extrabold text-2xl">{count}</div>
            <div className="text-[11px] text-wgray uppercase tracking-wider font-bold">{plan.name}</div>
          </div>
        ))}
        <div>
          <div className="font-display font-extrabold text-2xl">{freeCount}</div>
          <div className="text-[11px] text-wgray uppercase tracking-wider font-bold">Free demo configuration</div>
        </div>
      </div>

      <div className="space-y-3">
        {users.map((u) => (
          <UserPlanRow
            key={u.id}
            userRow={{ id: u.id, fullName: u.fullName, email: u.email, role: u.role, planId: u.planId }}
            plans={plans.map((p) => ({ id: p.id, name: p.name, priceUsdPerMonth: p.priceUsdPerMonth }))}
          />
        ))}
      </div>
    </div>
  );
}
