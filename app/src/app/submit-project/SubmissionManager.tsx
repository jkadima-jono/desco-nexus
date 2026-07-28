"use client";

import { useEffect, useState } from "react";
import { SECTORS, INSTRUMENTS, computeCompleteness, missingRequiredFields, STATUS_LABELS, type SubmissionDraft } from "@/lib/submissions";
import { trackProductEvent } from "@/components/ProductAnalytics";

type Submission = SubmissionDraft & {
  id: string;
  status: string;
  reviewNotes: string | null;
  publishedListingId: string | null;
};

const emptyForm: SubmissionDraft = {
  orgName: "", ownershipStatement: "", title: "", country: "", region: "",
  sector: "", stage: "", raiseUsd: null, fundingSecuredUsd: null, sponsorContributionUsd: null,
  instrument: "", useOfFunds: "", revenueModel: "", financialSummary: "", permitsStatus: "",
  landRights: "", governmentInvolvement: "", governmentBacked: false, esgSummary: "",
  keyRisks: "", managementTeam: "", advisors: "", documentsNote: "", timetable: "",
};

const FIELD_LABELS: Record<string, string> = {
  orgName: "Organization", title: "Project title", ownershipStatement: "Ownership statement",
  country: "Country", sector: "Sector", stage: "Stage", raiseUsd: "Capital required",
  instrument: "Instrument", useOfFunds: "Use of funds", keyRisks: "Key risks", managementTeam: "Management team",
};

export default function SubmissionManager() {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SubmissionDraft>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/submissions");
    if (res.ok) {
      const data = await res.json();
      setSubmissions(data.submissions);
      setShowForm(data.submissions.length === 0);
    }
  };
  useEffect(() => { load(); }, []);

  const startEdit = (s: Submission) => {
    setEditingId(s.id);
    setForm(s);
    setShowForm(true);
  };
  const startNew = () => {
    trackProductEvent("submission_started");
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };
  const cancel = () => { setEditingId(null); setForm(emptyForm); setShowForm(false); setError(null); };

  const save = async () => {
    setBusy(true); setError(null);
    try {
      const res = await fetch(editingId ? `/api/submissions/${editingId}` : "/api/submissions", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Could not save."); return; }
      if (!editingId) trackProductEvent("submission_started", { draftCreated: true });
      cancel();
      await load();
    } finally { setBusy(false); }
  };

  const submitForReview = async (id: string) => {
    setError(null);
    const res = await fetch(`/api/submissions/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "submit" }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error + (data.missing ? `: ${data.missing.map((f: string) => FIELD_LABELS[f] ?? f).join(", ")}` : "")); return; }
    trackProductEvent("submission_completed");
    await load();
  };
  const withdraw = async (id: string) => {
    await fetch(`/api/submissions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "withdraw" }) });
    await load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this draft? This cannot be undone.")) return;
    await fetch(`/api/submissions/${id}`, { method: "DELETE" });
    await load();
  };

  const completeness = computeCompleteness(form);
  const missing = missingRequiredFields(form);
  const input = "w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold";
  const label = "block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5";

  return (
    <div className="mt-8 space-y-6">
      {submissions === null ? (
        <div role="status" aria-live="polite" className="text-sm text-wgray">Loading your submissions…</div>
      ) : (
        <>
          {submissions.length > 0 && (
            <div className="space-y-3">
              {submissions.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display font-bold">{s.title || "Untitled project"}</div>
                      <div className="text-xs text-wgray mt-1">
                        {STATUS_LABELS[s.status]} · {computeCompleteness(s)}% complete
                      </div>
                      {s.reviewNotes && (
                        <div className="text-xs text-brandred mt-1.5 bg-brandred/5 rounded-lg px-2.5 py-1.5 max-w-md">
                          Reviewer note: {s.reviewNotes}
                        </div>
                      )}
                      {s.status === "approved" && s.publishedListingId && (
                        <a href={`/project/${s.publishedListingId}`} className="text-xs text-gold font-bold hover:underline mt-1.5 inline-block">
                          View published listing →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 text-xs font-semibold">
                    {(s.status === "draft" || s.status === "changes_requested") && (
                      <>
                        <button onClick={() => startEdit(s)} className="px-3 py-1.5 rounded-lg bg-mist hover:bg-gold-soft">Edit</button>
                        <button onClick={() => submitForReview(s.id)} className="px-3 py-1.5 rounded-lg bg-gold text-ink">Submit for review</button>
                      </>
                    )}
                    {(s.status === "submitted" || s.status === "under_review") && (
                      <button onClick={() => withdraw(s.id)} className="px-3 py-1.5 rounded-lg bg-mist hover:bg-gold-soft">Withdraw</button>
                    )}
                    {s.status === "draft" && (
                      <button onClick={() => remove(s.id)} className="px-3 py-1.5 rounded-lg bg-brandred/10 text-brandred hover:bg-brandred/20">Delete</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showForm && (
            <button onClick={startNew} className="bg-gold text-ink font-display font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110">
              + New project submission
            </button>
          )}

          {showForm && (
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)] space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h2 className="font-display font-bold text-lg">{editingId ? "Edit submission" : "New submission"}</h2>
                  <span className="text-xs font-bold text-wgray">{completeness}% complete</span>
                </div>
                <div className="h-1.5 rounded-full bg-mist overflow-hidden">
                  <div className="h-full bg-gold rounded-full transition-all" style={{ width: completeness + "%" }} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={label}>Organization</label><input className={input} value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} /></div>
                <div><label className={label}>Project title</label><input className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              </div>
              <div><label className={label}>Ownership statement</label><textarea rows={2} className={input + " resize-none"} value={form.ownershipStatement} onChange={(e) => setForm({ ...form, ownershipStatement: e.target.value })} placeholder="Describe your organization's legal ownership or development rights over this project" /></div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><label className={label}>Country</label><input className={input} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
                <div><label className={label}>Region</label><input className={input} value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} /></div>
                <div>
                  <label className={label}>Sector</label>
                  <select className={input} value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })}>
                    <option value="">Select</option>
                    {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={label}>Development stage</label><input className={input} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} placeholder="e.g. Feasibility documentation available; evidence pending" /></div>
                <div>
                  <label className={label}>Instrument</label>
                  <select className={input} value={form.instrument} onChange={(e) => setForm({ ...form, instrument: e.target.value })}>
                    <option value="">Select</option>
                    {INSTRUMENTS.map((i) => <option key={i} value={i} className="capitalize">{i}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><label className={label}>Capital required ($)</label><input type="number" min="0" className={input} value={form.raiseUsd ?? ""} onChange={(e) => setForm({ ...form, raiseUsd: e.target.value ? Number(e.target.value) : null })} /></div>
                <div><label className={label}>Funding secured ($)</label><input type="number" min="0" className={input} value={form.fundingSecuredUsd ?? ""} onChange={(e) => setForm({ ...form, fundingSecuredUsd: e.target.value ? Number(e.target.value) : null })} /></div>
                <div><label className={label}>Sponsor contribution ($)</label><input type="number" min="0" className={input} value={form.sponsorContributionUsd ?? ""} onChange={(e) => setForm({ ...form, sponsorContributionUsd: e.target.value ? Number(e.target.value) : null })} /></div>
              </div>
              <div><label className={label}>Use of funds</label><textarea rows={2} className={input + " resize-none"} value={form.useOfFunds} onChange={(e) => setForm({ ...form, useOfFunds: e.target.value })} /></div>
              <div><label className={label}>Revenue model</label><textarea rows={2} className={input + " resize-none"} value={form.revenueModel} onChange={(e) => setForm({ ...form, revenueModel: e.target.value })} /></div>
              <div><label className={label}>Financial information</label><textarea rows={2} className={input + " resize-none"} value={form.financialSummary} onChange={(e) => setForm({ ...form, financialSummary: e.target.value })} placeholder="Historical and/or projected figures, clearly labeled" /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={label}>Permits status</label><textarea rows={2} className={input + " resize-none"} value={form.permitsStatus} onChange={(e) => setForm({ ...form, permitsStatus: e.target.value })} /></div>
                <div><label className={label}>Land / operating rights</label><textarea rows={2} className={input + " resize-none"} value={form.landRights} onChange={(e) => setForm({ ...form, landRights: e.target.value })} /></div>
              </div>
              <div>
                <label className={label}>Government involvement</label>
                <textarea rows={2} className={input + " resize-none"} value={form.governmentInvolvement} onChange={(e) => setForm({ ...form, governmentInvolvement: e.target.value })} />
                <label className="flex items-center gap-2 text-sm mt-2">
                  <input type="checkbox" checked={form.governmentBacked} onChange={(e) => setForm({ ...form, governmentBacked: e.target.checked })} />
                  This project has disclosed, evidenced government backing
                </label>
              </div>
              <div><label className={label}>ESG information</label><textarea rows={2} className={input + " resize-none"} value={form.esgSummary} onChange={(e) => setForm({ ...form, esgSummary: e.target.value })} /></div>
              <div><label className={label}>Key risks</label><textarea rows={2} className={input + " resize-none"} value={form.keyRisks} onChange={(e) => setForm({ ...form, keyRisks: e.target.value })} /></div>
              <div><label className={label}>Management team</label><textarea rows={2} className={input + " resize-none"} value={form.managementTeam} onChange={(e) => setForm({ ...form, managementTeam: e.target.value })} /></div>
              <div><label className={label}>Advisors <span className="normal-case font-normal text-wgray/70">(optional)</span></label><textarea rows={2} className={input + " resize-none"} value={form.advisors} onChange={(e) => setForm({ ...form, advisors: e.target.value })} /></div>
              <div><label className={label}>Documents you can provide <span className="normal-case font-normal text-wgray/70">(optional — actual upload happens after approval)</span></label><textarea rows={2} className={input + " resize-none"} value={form.documentsNote} onChange={(e) => setForm({ ...form, documentsNote: e.target.value })} /></div>
              <div><label className={label}>Target timetable</label><textarea rows={2} className={input + " resize-none"} value={form.timetable} onChange={(e) => setForm({ ...form, timetable: e.target.value })} /></div>

              {missing.length > 0 && (
                <p className="text-xs text-wgray">Required to submit for review: {missing.map((f) => FIELD_LABELS[f] ?? f).join(", ")}</p>
              )}
              {error && <div role="alert" className="text-xs text-brandred bg-brandred/10 rounded-lg px-3 py-2">{error}</div>}

              <div className="flex gap-3">
                <button disabled={busy} onClick={save} className="bg-gold text-ink font-display font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110 disabled:opacity-60">
                  {busy ? "Saving…" : "Save draft"}
                </button>
                <button type="button" onClick={cancel} className="text-sm font-semibold text-wgray hover:text-charcoal">Cancel</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
