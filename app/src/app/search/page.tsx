"use client";

import { useState } from "react";
import type { Listing } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import { useI18n } from "@/components/I18nProvider";

const SUGGESTIONS = [
  "Infrastructure in DR Congo between $20M and $100M",
  "Agriculture in DR Congo under $10M",
  "Mining opportunities in DR Congo",
  "Healthcare in DR Congo under $20M",
];

export default function Search() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [out, setOut] = useState<{ results: Listing[]; interpretation: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const run = async (query: string) => {
    const cleaned = query.trim();
    if (!cleaned) return;
    setSubmitted(cleaned);
    setSaved(false);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/search?q=" + encodeURIComponent(cleaned));
      if (!res.ok) throw new Error(String(res.status));
      setOut(await res.json());
    } catch {
      setOut(null);
      setError("Search failed — retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight">
        <span className="text-gold">✦</span> {t("search.title")}
      </h1>
      <p className="text-wgray text-sm mt-1 mb-6">{t("search.subtitle")}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) run(q);
        }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <label htmlFor="investment-search" className="sr-only">Describe your investment mandate</label>
        <input
          id="investment-search"
          name="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("search.placeholder")}
          className="flex-1 bg-white rounded-2xl px-5 py-4 text-sm shadow-[0_1px_3px_rgb(44_62_80/0.08)] outline-none focus:ring-2 focus:ring-gold"
        />
        <button disabled={!q.trim() || loading} className="min-h-12 bg-charcoal text-white font-display font-bold text-sm px-6 rounded-2xl hover:bg-ink disabled:opacity-40 disabled:cursor-not-allowed">
          {t("search.button")}
        </button>
      </form>

      {!submitted && (
        <div className="mt-5 flex flex-wrap gap-2">
          {SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              onClick={() => { setQ(sug); run(sug); }}
              className="text-xs bg-white px-3.5 py-2 rounded-full shadow-[0_1px_3px_rgb(44_62_80/0.08)] hover:ring-2 hover:ring-gold text-charcoal/80"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div role="status" aria-live="polite" className="mt-6 text-sm text-wgray">{t("search.loading")}</div>
      )}
      {error && (
        <div role="alert" className="mt-6 bg-brandred/10 border-l-4 border-brandred rounded-xl px-4 py-3 text-sm text-brandred">{error}</div>
      )}
      {out && !loading && (
        <div className="mt-6">
          <div className="bg-gold-soft border-l-4 border-gold rounded-xl px-4 py-3 text-sm mb-5">
            <span className="font-bold text-gold">{t("search.parsed")}</span>{" "}
            {out.interpretation} — {out.results.length}{" "}
            {out.results.length === 1 ? t("search.match") : t("search.matches")}
          </div>
          <div className="grid gap-5">
            {out.results.map((l, i) => (
              <ProjectCard key={l.id} listing={l} index={i} />
            ))}
            {out.results.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center text-sm text-wgray">
                <p>{t("search.none")}</p>
                {submitted && <button type="button" onClick={async () => {
                  const res = await fetch("/api/mandates", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: submitted.slice(0, 60), query: submitted, criteria: out?.interpretation ? [out.interpretation] : [] }),
                  });
                  if (res.status === 401) { window.location.href = "/login"; return; }
                  if (res.ok) setSaved(true);
                }} className="mt-4 bg-charcoal text-white font-display font-bold px-4 py-2.5 rounded-xl hover:bg-ink focus-visible:ring-2 focus-visible:ring-gold">{saved ? t("mandates.saved") : t("mandates.save")}</button>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
