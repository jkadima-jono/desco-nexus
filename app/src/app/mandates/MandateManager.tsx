"use client";

import { useEffect, useState } from "react";
import { trackProductEvent } from "@/components/ProductAnalytics";
import {
  SECTORS, INSTRUMENTS, RISK_LEVELS, INVESTOR_TYPES, INVESTOR_TYPE_LABELS,
} from "@/lib/mandateOptions";

type Mandate = {
  id: string;
  name: string;
  query: string;
  active: boolean;
  frequency: string;
  investorType: string | null;
  sectors: string;
  countries: string;
  ticketMinUsd: number | null;
  ticketMaxUsd: number | null;
  instruments: string;
  stagePreference: string | null;
  targetReturn: string | null;
  horizonYears: number | null;
  riskTolerance: string | null;
  currency: string;
  esgRequired: boolean;
  govSupportRequired: boolean;
  excludedSectors: string;
  excludedCountries: string;
  coInvestPreference: string | null;
};

const parseArr = (s: string): string[] => {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

const emptyForm = {
  name: "",
  investorType: "",
  sectors: [] as string[],
  countries: "",
  ticketMinM: "",
  ticketMaxM: "",
  instruments: [] as string[],
  stagePreference: "",
  targetReturn: "",
  horizonYears: "",
  riskTolerance: "",
  currency: "USD",
  esgRequired: false,
  govSupportRequired: false,
  excludedSectors: [] as string[],
  excludedCountries: "",
  coInvestPreference: "",
  frequency: "weekly",
  query: "",
};

function toggleIn<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export default function MandateManager() {
  const [mandates, setMandates] = useState<Mandate[] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const res = await fetch("/api/mandates");
    if (res.ok) {
      const data = await res.json();
      setMandates(data.mandates);
      setShowForm(data.mandates.length === 0);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (m: Mandate) => {
    setEditingId(m.id);
    setForm({
      name: m.name,
      investorType: m.investorType ?? "",
      sectors: parseArr(m.sectors),
      countries: parseArr(m.countries).join(", "),
      ticketMinM: m.ticketMinUsd ? String(m.ticketMinUsd / 1e6) : "",
      ticketMaxM: m.ticketMaxUsd ? String(m.ticketMaxUsd / 1e6) : "",
      instruments: parseArr(m.instruments),
      stagePreference: m.stagePreference ?? "",
      targetReturn: m.targetReturn ?? "",
      horizonYears: m.horizonYears ? String(m.horizonYears) : "",
      riskTolerance: m.riskTolerance ?? "",
      currency: m.currency,
      esgRequired: m.esgRequired,
      govSupportRequired: m.govSupportRequired,
      excludedSectors: parseArr(m.excludedSectors),
      excludedCountries: parseArr(m.excludedCountries).join(", "),
      coInvestPreference: m.coInvestPreference ?? "",
      frequency: m.frequency,
      query: m.query,
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      name: form.name,
      query: form.query,
      frequency: form.frequency,
      investorType: form.investorType || undefined,
      sectors: form.sectors,
      countries: form.countries.split(",").map((s) => s.trim()).filter(Boolean),
      ticketMinUsd: form.ticketMinM ? Math.round(parseFloat(form.ticketMinM) * 1e6) : null,
      ticketMaxUsd: form.ticketMaxM ? Math.round(parseFloat(form.ticketMaxM) * 1e6) : null,
      instruments: form.instruments,
      stagePreference: form.stagePreference || undefined,
      targetReturn: form.targetReturn || undefined,
      horizonYears: form.horizonYears ? parseInt(form.horizonYears, 10) : null,
      riskTolerance: form.riskTolerance || undefined,
      currency: form.currency,
      esgRequired: form.esgRequired,
      govSupportRequired: form.govSupportRequired,
      excludedSectors: form.excludedSectors,
      excludedCountries: form.excludedCountries.split(",").map((s) => s.trim()).filter(Boolean),
      coInvestPreference: form.coInvestPreference || undefined,
    };
    try {
      const res = await fetch("/api/mandates", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save mandate.");
        return;
      }
      if (!editingId) trackProductEvent("mandate_created", { investorType: form.investorType || "unspecified" });
      cancelEdit();
      await load();
    } catch {
      setError("Network error — retry.");
    } finally {
      setBusy(false);
    }
  };

  const act = async (id: string, body: Record<string, unknown>) => {
    await fetch("/api/mandates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this mandate? This cannot be undone.")) return;
    await fetch(`/api/mandates?id=${id}`, { method: "DELETE" });
    await load();
  };

  // Completion progress across the guided-builder dimensions — purely a
  // UI signal for the owner filling the form, not enforced server-side.
  const completenessChecks = [
    !!form.name.trim(),
    !!form.investorType,
    form.sectors.length > 0,
    !!form.countries.trim(),
    !!form.ticketMinM || !!form.ticketMaxM,
    form.instruments.length > 0,
    !!form.riskTolerance,
    !!form.targetReturn.trim(),
    !!form.horizonYears,
    !!form.coInvestPreference,
  ];
  const mandateCompleteness = Math.round(
    (completenessChecks.filter(Boolean).length / completenessChecks.length) * 100
  );

  return (
    <div className="mt-8 space-y-6">
      {mandates === null ? (
        <div role="status" aria-live="polite" className="text-sm text-wgray">Loading your mandates…</div>
      ) : (
        <>
          {mandates.length > 0 && (
            <div className="space-y-3">
              {mandates.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display font-bold flex items-center gap-2">
                        {m.name}
                        <span className={"text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full " + (m.active ? "bg-emerald-p/15 text-emerald-p" : "bg-wgray/15 text-wgray")}>
                          {m.active ? "Active" : "Paused"}
                        </span>
                      </div>
                      <div className="text-xs text-wgray mt-1">
                        {parseArr(m.sectors).join(", ") || "Any sector"} · {m.ticketMinUsd || m.ticketMaxUsd
                          ? `$${m.ticketMinUsd ? Math.round(m.ticketMinUsd / 1e6) : 0}M–${m.ticketMaxUsd ? "$" + Math.round(m.ticketMaxUsd / 1e6) + "M" : "no max"}`
                          : "Any ticket size"} · {m.frequency} alerts
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 text-xs font-semibold">
                    <button onClick={() => startEdit(m)} className="px-3 py-1.5 rounded-lg bg-mist hover:bg-gold-soft">Edit</button>
                    <button onClick={() => act(m.id, { active: !m.active })} className="px-3 py-1.5 rounded-lg bg-mist hover:bg-gold-soft">
                      {m.active ? "Pause" : "Resume"}
                    </button>
                    <button onClick={() => act(m.id, { duplicate: true })} className="px-3 py-1.5 rounded-lg bg-mist hover:bg-gold-soft">Duplicate</button>
                    <button onClick={() => remove(m.id)} className="px-3 py-1.5 rounded-lg bg-brandred/10 text-brandred hover:bg-brandred/20">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showForm && (
            <button onClick={() => setShowForm(true)} className="bg-gold text-ink font-display font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110">
              + New mandate
            </button>
          )}

          {showForm && (
            <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)] space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h2 className="font-display font-bold text-lg">{editingId ? "Edit mandate" : "New mandate"}</h2>
                  <span className="text-xs font-bold text-wgray">{mandateCompleteness}% complete</span>
                </div>
                <div className="h-1.5 rounded-full bg-mist overflow-hidden">
                  <div className="h-full bg-gold rounded-full transition-all" style={{ width: mandateCompleteness + "%" }} />
                </div>
              </div>

              <div>
                <label htmlFor="m-name" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Mandate name</label>
                <input id="m-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold" />
              </div>

              <div>
                <label htmlFor="m-type" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Investor type</label>
                <select id="m-type" value={form.investorType} onChange={(e) => setForm({ ...form, investorType: e.target.value })}
                  className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold">
                  <option value="">Not specified</option>
                  {INVESTOR_TYPES.map((v) => <option key={v} value={v}>{INVESTOR_TYPE_LABELS[v]}</option>)}
                </select>
              </div>

              <fieldset>
                <legend className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Target sectors</legend>
                <div className="flex flex-wrap gap-2">
                  {SECTORS.map((s) => (
                    <label key={s} className="flex items-center gap-1.5 text-sm bg-mist px-3 py-1.5 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={form.sectors.includes(s)} onChange={() => setForm({ ...form, sectors: toggleIn(form.sectors, s) })} />
                      {s}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="m-countries" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">
                  Target countries/regions <span className="normal-case font-normal text-wgray/70">(comma-separated, e.g. "DR Congo")</span>
                </label>
                <input id="m-countries" value={form.countries} onChange={(e) => setForm({ ...form, countries: e.target.value })}
                  className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="m-min" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Min ticket ($M)</label>
                  <input id="m-min" type="number" min="0" value={form.ticketMinM} onChange={(e) => setForm({ ...form, ticketMinM: e.target.value })}
                    className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold" />
                </div>
                <div>
                  <label htmlFor="m-max" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Max ticket ($M)</label>
                  <input id="m-max" type="number" min="0" value={form.ticketMaxM} onChange={(e) => setForm({ ...form, ticketMaxM: e.target.value })}
                    className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold" />
                </div>
              </div>

              <fieldset>
                <legend className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Preferred instruments</legend>
                <div className="flex flex-wrap gap-2">
                  {INSTRUMENTS.map((i) => (
                    <label key={i} className="flex items-center gap-1.5 text-sm bg-mist px-3 py-1.5 rounded-lg cursor-pointer capitalize">
                      <input type="checkbox" checked={form.instruments.includes(i)} onChange={() => setForm({ ...form, instruments: toggleIn(form.instruments, i) })} />
                      {i}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="m-return" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Target return</label>
                  <input id="m-return" placeholder="e.g. 15-20% IRR" value={form.targetReturn} onChange={(e) => setForm({ ...form, targetReturn: e.target.value })}
                    className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold" />
                </div>
                <div>
                  <label htmlFor="m-horizon" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Horizon (years)</label>
                  <input id="m-horizon" type="number" min="0" max="50" value={form.horizonYears} onChange={(e) => setForm({ ...form, horizonYears: e.target.value })}
                    className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="m-risk" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Risk tolerance</label>
                  <select id="m-risk" value={form.riskTolerance} onChange={(e) => setForm({ ...form, riskTolerance: e.target.value })}
                    className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold">
                    <option value="">Not specified</option>
                    {RISK_LEVELS.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="m-freq" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Alert frequency</label>
                  <select id="m-freq" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                    className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.esgRequired} onChange={(e) => setForm({ ...form, esgRequired: e.target.checked })} />
                  Require strong ESG profile
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.govSupportRequired} onChange={(e) => setForm({ ...form, govSupportRequired: e.target.checked })} />
                  Require disclosed government backing
                </label>
              </div>

              <fieldset>
                <legend className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Excluded sectors</legend>
                <div className="flex flex-wrap gap-2">
                  {SECTORS.map((s) => (
                    <label key={s} className="flex items-center gap-1.5 text-sm bg-mist px-3 py-1.5 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={form.excludedSectors.includes(s)} onChange={() => setForm({ ...form, excludedSectors: toggleIn(form.excludedSectors, s) })} />
                      {s}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="m-excl-countries" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">
                  Excluded jurisdictions <span className="normal-case font-normal text-wgray/70">(comma-separated)</span>
                </label>
                <input id="m-excl-countries" value={form.excludedCountries} onChange={(e) => setForm({ ...form, excludedCountries: e.target.value })}
                  className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold" />
              </div>

              <div>
                <label htmlFor="m-note" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">
                  Notes <span className="normal-case font-normal text-wgray/70">(optional, freeform)</span>
                </label>
                <textarea id="m-note" rows={2} value={form.query} onChange={(e) => setForm({ ...form, query: e.target.value })}
                  className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold resize-none" />
              </div>

              {error && <div role="alert" className="text-xs text-brandred bg-brandred/10 rounded-lg px-3 py-2">{error}</div>}

              <div className="flex gap-3">
                <button disabled={busy} className="bg-gold text-ink font-display font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110 disabled:opacity-60">
                  {busy ? "Saving…" : editingId ? "Save changes" : "Save mandate"}
                </button>
                <button type="button" onClick={cancelEdit} className="text-sm font-semibold text-wgray hover:text-charcoal">Cancel</button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
