"use client";

import { useEffect, useState } from "react";
import { SECTORS, INSTRUMENTS, computeCompleteness, missingRequiredFields, type SubmissionDraft } from "@/lib/submissions";
import { trackProductEvent } from "@/components/ProductAnalytics";
import { projectHref } from "@/lib/project-slugs";
import { useI18n } from "@/components/I18nProvider";
import { submissionCopy, submissionSuccess } from "@/lib/translations/submissions";

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

export default function SubmissionManager() {
  const { locale } = useI18n();
  const ui = submissionCopy(locale);
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SubmissionDraft>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/submissions");
      if (!res.ok) { setLoadFailed(true); return; }
      const data = await res.json();
      setSubmissions(data.submissions);
      setShowForm(data.submissions.length === 0);
      setLoadFailed(false);
    } catch { setLoadFailed(true); }
  };
  useEffect(() => { load(); }, []);

  const clearNotices = () => { setError(null); setSuccess(null); };
  const startEdit = (s: Submission) => {
    clearNotices();
    setEditingId(s.id);
    setForm(s);
    setShowForm(true);
  };
  const startNew = () => {
    clearNotices();
    trackProductEvent("submission_started");
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };
  const cancel = () => { setEditingId(null); setForm(emptyForm); setShowForm(false); setError(null); };

  const save = async () => {
    setBusy(true); clearNotices();
    try {
      const res = await fetch(editingId ? `/api/submissions/${editingId}` : "/api/submissions", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(ui.saveError); return; }
      if (!editingId) trackProductEvent("submission_started", { draftCreated: true });
      cancel();
      await load();
      setSuccess(submissionSuccess(locale, "saved"));
    } catch { setError(ui.networkError); } finally { setBusy(false); }
  };

  const submitForReview = async (id: string) => {
    clearNotices();
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "submit" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(ui.submitError + (data.missing ? ` ${ui.required}: ${data.missing.map((f: string) => ui.labels[f as keyof typeof ui.labels] ?? f).join(", ")}` : "")); return; }
      trackProductEvent("submission_completed");
      await load();
      setSuccess(submissionSuccess(locale, "submitted"));
    } catch { setError(ui.networkError); }
  };
  const withdraw = async (id: string) => {
    clearNotices();
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "withdraw" }) });
      if (!res.ok) { setError(ui.withdrawError); return; }
      await load();
      setSuccess(submissionSuccess(locale, "withdrawn"));
    } catch { setError(ui.networkError); }
  };
  const remove = async (id: string) => {
    if (!confirm(ui.deleteConfirm)) return;
    clearNotices();
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
      if (!res.ok) { setError(ui.deleteError); return; }
      await load();
      setSuccess(submissionSuccess(locale, "deleted"));
    } catch { setError(ui.networkError); }
  };

  const completeness = computeCompleteness(form);
  const missing = missingRequiredFields(form);
  const input = "w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold";
  const label = "block text-xs font-bold uppercase tracking-wider text-wgray mb-1.5";

  return (
    <div className="mt-8 space-y-6">
      {success && <div role="status" aria-live="polite" className="rounded-xl bg-emerald-p/10 px-4 py-3 text-sm font-semibold text-emerald-p">{success}</div>}
      {loadFailed ? (
        <div role="alert" className="rounded-xl bg-brandred/10 p-4 text-sm text-brandred">
          {ui.loadError} <button type="button" onClick={load} className="ml-2 font-bold underline">{ui.retry}</button>
        </div>
      ) : submissions === null ? (
        <div role="status" aria-live="polite" className="text-sm text-wgray">{ui.loading}</div>
      ) : (
        <>
          {submissions.length > 0 && (
            <div className="space-y-3">
              {submissions.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display font-bold">{s.title || ui.untitled}</div>
                      <div className="text-xs text-wgray mt-1">
                        {ui.statuses[s.status] ?? s.status} · {ui.complete(computeCompleteness(s))}
                      </div>
                      {s.reviewNotes && (
                        <div className="text-xs text-brandred mt-1.5 bg-brandred/5 rounded-lg px-2.5 py-1.5 max-w-md">
                          {ui.reviewerNote}: {s.reviewNotes}
                        </div>
                      )}
                      {s.status === "approved" && s.publishedListingId && (
                        <a href={projectHref(s.publishedListingId)} className="text-sm text-gold font-bold hover:underline mt-1.5 inline-block">
                          {ui.published} →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 text-xs font-semibold">
                    {(s.status === "draft" || s.status === "changes_requested") && (
                      <>
                        <button onClick={() => startEdit(s)} className="px-3 py-1.5 rounded-lg bg-mist hover:bg-gold-soft">{ui.edit}</button>
                        <button onClick={() => submitForReview(s.id)} className="px-3 py-1.5 rounded-lg bg-gold text-ink">{ui.submit}</button>
                      </>
                    )}
                    {(s.status === "submitted" || s.status === "under_review") && (
                      <button onClick={() => withdraw(s.id)} className="px-3 py-1.5 rounded-lg bg-mist hover:bg-gold-soft">{ui.withdraw}</button>
                    )}
                    {s.status === "draft" && (
                      <button onClick={() => remove(s.id)} className="px-3 py-1.5 rounded-lg bg-brandred/10 text-brandred hover:bg-brandred/20">{ui.delete}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showForm && (
            <button onClick={startNew} className="bg-gold text-ink font-display font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110">
              + {ui.newProject}
            </button>
          )}

          {showForm && (
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)] space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h2 className="font-display font-bold text-lg">{editingId ? ui.editTitle : ui.newTitle}</h2>
                  <span className="text-xs font-bold text-wgray">{ui.complete(completeness)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-mist overflow-hidden">
                  <div className="h-full bg-gold rounded-full transition-all" style={{ width: completeness + "%" }} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div><label htmlFor="submission-orgName" className={label}>{ui.labels.orgName}</label><input id="submission-orgName" name="orgName" className={input} value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} /></div>
                <div><label htmlFor="submission-title" className={label}>{ui.labels.title}</label><input id="submission-title" name="title" className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              </div>
              <div><label htmlFor="submission-ownershipStatement" className={label}>{ui.labels.ownershipStatement}</label><textarea id="submission-ownershipStatement" name="ownershipStatement" rows={2} className={input + " resize-none"} value={form.ownershipStatement} onChange={(e) => setForm({ ...form, ownershipStatement: e.target.value })} placeholder={ui.placeholders.ownership} /></div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><label htmlFor="submission-country" className={label}>{ui.labels.country}</label><input id="submission-country" name="country" className={input} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
                <div><label htmlFor="submission-region" className={label}>{ui.labels.region}</label><input id="submission-region" name="region" className={input} value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} /></div>
                <div>
                  <label htmlFor="submission-sector" className={label}>{ui.labels.sector}</label>
                  <select id="submission-sector" name="sector" className={input} value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })}>
                    <option value="">{ui.select}</option>
                    {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label htmlFor="submission-stage" className={label}>{ui.labels.stage}</label><input id="submission-stage" name="stage" className={input} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} placeholder={ui.placeholders.stage} /></div>
                <div>
                  <label htmlFor="submission-instrument" className={label}>{ui.labels.instrument}</label>
                  <select id="submission-instrument" name="instrument" className={input} value={form.instrument} onChange={(e) => setForm({ ...form, instrument: e.target.value })}>
                    <option value="">{ui.select}</option>
                    {INSTRUMENTS.map((i) => <option key={i} value={i} className="capitalize">{i}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><label htmlFor="submission-raiseUsd" className={label}>{ui.labels.raiseUsd}</label><input id="submission-raiseUsd" name="raiseUsd" type="number" min="0" className={input} value={form.raiseUsd ?? ""} onChange={(e) => setForm({ ...form, raiseUsd: e.target.value ? Number(e.target.value) : null })} /></div>
                <div><label htmlFor="submission-fundingSecuredUsd" className={label}>{ui.labels.fundingSecuredUsd}</label><input id="submission-fundingSecuredUsd" name="fundingSecuredUsd" type="number" min="0" className={input} value={form.fundingSecuredUsd ?? ""} onChange={(e) => setForm({ ...form, fundingSecuredUsd: e.target.value ? Number(e.target.value) : null })} /></div>
                <div><label htmlFor="submission-sponsorContributionUsd" className={label}>{ui.labels.sponsorContributionUsd}</label><input id="submission-sponsorContributionUsd" name="sponsorContributionUsd" type="number" min="0" className={input} value={form.sponsorContributionUsd ?? ""} onChange={(e) => setForm({ ...form, sponsorContributionUsd: e.target.value ? Number(e.target.value) : null })} /></div>
              </div>
              <div><label htmlFor="submission-useOfFunds" className={label}>{ui.labels.useOfFunds}</label><textarea id="submission-useOfFunds" name="useOfFunds" rows={2} className={input + " resize-none"} value={form.useOfFunds} onChange={(e) => setForm({ ...form, useOfFunds: e.target.value })} /></div>
              <div><label htmlFor="submission-revenueModel" className={label}>{ui.labels.revenueModel}</label><textarea id="submission-revenueModel" name="revenueModel" rows={2} className={input + " resize-none"} value={form.revenueModel} onChange={(e) => setForm({ ...form, revenueModel: e.target.value })} /></div>
              <div><label htmlFor="submission-financialSummary" className={label}>{ui.labels.financialSummary}</label><textarea id="submission-financialSummary" name="financialSummary" rows={2} className={input + " resize-none"} value={form.financialSummary} onChange={(e) => setForm({ ...form, financialSummary: e.target.value })} placeholder={ui.placeholders.financial} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label htmlFor="submission-permitsStatus" className={label}>{ui.labels.permitsStatus}</label><textarea id="submission-permitsStatus" name="permitsStatus" rows={2} className={input + " resize-none"} value={form.permitsStatus} onChange={(e) => setForm({ ...form, permitsStatus: e.target.value })} /></div>
                <div><label htmlFor="submission-landRights" className={label}>{ui.labels.landRights}</label><textarea id="submission-landRights" name="landRights" rows={2} className={input + " resize-none"} value={form.landRights} onChange={(e) => setForm({ ...form, landRights: e.target.value })} /></div>
              </div>
              <div>
                <label htmlFor="submission-governmentInvolvement" className={label}>{ui.labels.governmentInvolvement}</label>
                <textarea id="submission-governmentInvolvement" name="governmentInvolvement" rows={2} className={input + " resize-none"} value={form.governmentInvolvement} onChange={(e) => setForm({ ...form, governmentInvolvement: e.target.value })} />
                <label className="flex items-center gap-2 text-sm mt-2">
                  <input id="submission-governmentBacked" name="governmentBacked" type="checkbox" checked={form.governmentBacked} onChange={(e) => setForm({ ...form, governmentBacked: e.target.checked })} />
                  {ui.labels.governmentBacked}
                </label>
              </div>
              <div><label htmlFor="submission-esgSummary" className={label}>{ui.labels.esgSummary}</label><textarea id="submission-esgSummary" name="esgSummary" rows={2} className={input + " resize-none"} value={form.esgSummary} onChange={(e) => setForm({ ...form, esgSummary: e.target.value })} /></div>
              <div><label htmlFor="submission-keyRisks" className={label}>{ui.labels.keyRisks}</label><textarea id="submission-keyRisks" name="keyRisks" rows={2} className={input + " resize-none"} value={form.keyRisks} onChange={(e) => setForm({ ...form, keyRisks: e.target.value })} /></div>
              <div><label htmlFor="submission-managementTeam" className={label}>{ui.labels.managementTeam}</label><textarea id="submission-managementTeam" name="managementTeam" rows={2} className={input + " resize-none"} value={form.managementTeam} onChange={(e) => setForm({ ...form, managementTeam: e.target.value })} /></div>
              <div><label htmlFor="submission-advisors" className={label}>{ui.labels.advisors} <span className="normal-case font-normal text-wgray/70">({ui.optional})</span></label><textarea id="submission-advisors" name="advisors" rows={2} className={input + " resize-none"} value={form.advisors} onChange={(e) => setForm({ ...form, advisors: e.target.value })} /></div>
              <div><label htmlFor="submission-documentsNote" className={label}>{ui.labels.documentsNote} <span className="normal-case font-normal text-wgray/70">({ui.documentsOptional})</span></label><textarea id="submission-documentsNote" name="documentsNote" rows={2} className={input + " resize-none"} value={form.documentsNote} onChange={(e) => setForm({ ...form, documentsNote: e.target.value })} /></div>
              <div><label htmlFor="submission-timetable" className={label}>{ui.labels.timetable}</label><textarea id="submission-timetable" name="timetable" rows={2} className={input + " resize-none"} value={form.timetable} onChange={(e) => setForm({ ...form, timetable: e.target.value })} /></div>

              {missing.length > 0 && (
                <p className="text-xs text-wgray">{ui.required}: {missing.map((f) => ui.labels[f as keyof typeof ui.labels] ?? f).join(", ")}</p>
              )}
              {error && <div role="alert" className="text-xs text-brandred bg-brandred/10 rounded-lg px-3 py-2">{error}</div>}

              <div className="flex gap-3">
                <button disabled={busy} onClick={save} className="bg-gold text-ink font-display font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110 disabled:opacity-60">
                  {busy ? ui.saving : ui.save}
                </button>
                <button type="button" onClick={cancel} className="text-sm font-semibold text-wgray hover:text-charcoal">{ui.cancel}</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
