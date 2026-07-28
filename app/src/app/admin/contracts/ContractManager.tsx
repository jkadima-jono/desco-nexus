"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Option = { id: string; name: string };
type Contract = {
  id: string;
  status: string;
  currency: string;
  annualValueMinor: number | null;
  seatLimit: number | null;
  startsAt: string | null;
  endsAt: string | null;
  organization: { name: string };
  plan: { name: string };
};

export default function ContractManager({
  organizations,
  plans,
  contracts,
}: {
  organizations: Option[];
  plans: Option[];
  contracts: Contract[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgId, setOrgId] = useState(organizations[0]?.id ?? "");
  const [planId, setPlanId] = useState(plans[0]?.id ?? "");

  const request = async (body: Record<string, unknown>) => {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/contracts", {
      method: "id" in body ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "The contract could not be updated.");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form
        className="grid gap-4 rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)] md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          void request({
            orgId,
            planId,
            currency: form.get("currency"),
            annualValueMinor: Math.round(Number(form.get("annualValue") || 0) * 100) || null,
            seatLimit: Number(form.get("seatLimit")) || null,
            serviceLevel: form.get("serviceLevel"),
            dataRetentionDays: Number(form.get("dataRetentionDays")) || null,
            termsVersion: form.get("termsVersion"),
            startsAt: form.get("startsAt") || null,
            endsAt: form.get("endsAt") || null,
          });
        }}
      >
        <h2 className="font-display text-lg font-bold md:col-span-2">Create draft organization contract</h2>
        <label className="text-xs font-bold">Organization<select value={orgId} onChange={(e) => setOrgId(e.target.value)} className="mt-1 w-full rounded-lg bg-mist p-3 font-normal">{organizations.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
        <label className="text-xs font-bold">Workspace package<select value={planId} onChange={(e) => setPlanId(e.target.value)} className="mt-1 w-full rounded-lg bg-mist p-3 font-normal">{plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label className="text-xs font-bold">Annual contract value<input name="annualValue" type="number" min="0" step="0.01" className="mt-1 w-full rounded-lg bg-mist p-3 font-normal" /></label>
        <label className="text-xs font-bold">Currency<input name="currency" defaultValue="USD" maxLength={3} className="mt-1 w-full rounded-lg bg-mist p-3 font-normal uppercase" /></label>
        <label className="text-xs font-bold">Seat limit<input name="seatLimit" type="number" min="1" className="mt-1 w-full rounded-lg bg-mist p-3 font-normal" /></label>
        <label className="text-xs font-bold">Data retention (days)<input name="dataRetentionDays" type="number" min="1" className="mt-1 w-full rounded-lg bg-mist p-3 font-normal" /></label>
        <label className="text-xs font-bold">Starts<input name="startsAt" type="date" className="mt-1 w-full rounded-lg bg-mist p-3 font-normal" /></label>
        <label className="text-xs font-bold">Ends<input name="endsAt" type="date" className="mt-1 w-full rounded-lg bg-mist p-3 font-normal" /></label>
        <label className="text-xs font-bold">Terms version<input name="termsVersion" className="mt-1 w-full rounded-lg bg-mist p-3 font-normal" /></label>
        <label className="text-xs font-bold">Service level<input name="serviceLevel" className="mt-1 w-full rounded-lg bg-mist p-3 font-normal" /></label>
        {error && <p role="alert" className="text-sm text-brandred md:col-span-2">{error}</p>}
        <button disabled={busy || !orgId || !planId} className="button-primary md:col-span-2">{busy ? "Saving…" : "Create draft"}</button>
      </form>

      <div className="space-y-3">
        {contracts.map((contract) => (
          <article key={contract.id} className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display font-bold">{contract.organization.name}</h2>
                <p className="text-xs text-wgray">{contract.plan.name} · {contract.status} · {contract.seatLimit ? `${contract.seatLimit} seats` : "Seats scoped separately"}</p>
                <p className="mt-1 text-xs text-wgray">{contract.annualValueMinor == null ? "Value not recorded" : new Intl.NumberFormat(undefined, { style: "currency", currency: contract.currency }).format(contract.annualValueMinor / 100)}</p>
              </div>
              <select
                value={contract.status}
                disabled={busy}
                aria-label={`Contract status for ${contract.organization.name}`}
                onChange={(e) => {
                  const note = window.prompt(`Reason for changing status to ${e.target.value}`);
                  if (note) void request({ id: contract.id, status: e.target.value, note });
                }}
                className="rounded-lg bg-mist px-3 py-2 text-xs font-bold"
              >
                {["draft", "approved", "active", "suspended", "expired", "cancelled"].map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
          </article>
        ))}
        {contracts.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-sm text-wgray">No organization contracts recorded.</p>}
      </div>
    </div>
  );
}
