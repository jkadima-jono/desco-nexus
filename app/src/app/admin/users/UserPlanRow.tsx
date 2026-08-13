"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserRow = { id: string; fullName: string; email: string; role: string; planId: string | null };
type PlanOption = { id: string; name: string; priceUsdPerMonth: number };

export default function UserPlanRow({ userRow, plans }: { userRow: UserRow; plans: PlanOption[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const assign = async (planId: string) => {
    setBusy(true);
    await fetch("/api/admin/users/" + userRow.id + "/plan", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: planId || null }),
    });
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="bg-white  p-4  flex items-center justify-between gap-4">
      <div>
        <div className="font-display font-bold text-sm">{userRow.fullName}</div>
        <div className="text-xs text-wgray">{userRow.email} · {userRow.role}</div>
      </div>
      <select
        value={userRow.planId ?? ""}
        disabled={busy}
        onChange={(e) => assign(e.target.value)}
        className="bg-mist  px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        aria-label={"Demo entitlement configuration for " + userRow.fullName}
      >
        <option value="">Free demo configuration</option>
        {plans.map((p) => (
          <option key={p.id} value={p.id}>{p.name} — scenario ${p.priceUsdPerMonth}/month</option>
        ))}
      </select>
    </div>
  );
}
