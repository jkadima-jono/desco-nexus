"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STAGES } from "@/lib/deals";

export default function StageControl({
  dealId,
  current,
}: {
  dealId: string;
  current: string;
}) {
  const router = useRouter();
  const [target, setTarget] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ci = STAGES.indexOf(current as (typeof STAGES)[number]);
  const backward = target && STAGES.indexOf(target as (typeof STAGES)[number]) < ci;

  const apply = async () => {
    if (!target || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/deals/" + dealId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: target, reason: reason || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Transition failed");
        return;
      }
      setTarget("");
      setReason("");
      router.refresh();
    } catch {
      setError("Network error — retry.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-4" role="group" aria-label="Deal stages">
        {STAGES.map((s, i) => (
          <span
            key={s}
            aria-current={s === current ? "step" : undefined}
            className={
              "px-2.5 py-1 rounded-full text-[11px] font-bold " +
              (s === current
                ? "bg-charcoal text-white"
                : i < ci
                ? "bg-gold-soft text-gold"
                : "bg-mist text-wgray")
            }
          >
            {i < ci ? "✓ " : ""}{s}
          </span>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <label className="sr-only" htmlFor="stage-select">Move to stage</label>
        <select
          id="stage-select"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="bg-mist rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">Move to…</option>
          {STAGES.filter((s) => s !== current).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={backward ? "Reason (required for rollback)" : "Reason (optional)"}
          aria-label="Transition reason"
          className="flex-1 bg-mist rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
        />
        <button
          onClick={apply}
          disabled={!target || busy || (Boolean(backward) && !reason.trim())}
          className="bg-gold text-ink font-display font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110 disabled:opacity-50"
        >
          {busy ? "Applying…" : "Apply"}
        </button>
      </div>
      {error && <div role="alert" className="text-xs text-brandred mt-2">{error}</div>}
      <p className="text-[11px] text-wgray mt-2">
        Forward moves advance one stage after entry requirements are met; any
        rollback requires a recorded reason. All changes are audit-logged.
      </p>
    </div>
  );
}
