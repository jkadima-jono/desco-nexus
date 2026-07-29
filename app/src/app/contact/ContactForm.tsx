"use client";

import { useState } from "react";
import Link from "next/link";
import { trackProductEvent } from "@/components/ProductAnalytics";
import type { Locale } from "@/lib/i18n";
import { contactLegalAcknowledgement, investmentUi } from "@/lib/translations/investment-ui";

const TOPICS = [
  { value: "general", label: "General inquiry" },
  { value: "investor-access", label: "Investor workspace access" },
  { value: "project-submission", label: "Submit a project" },
  { value: "data-room", label: "Data-room access question" },
  { value: "institutional-partnership", label: "Institutional partnership" },
  { value: "commercial-model", label: "Commercial scope and workspace model" },
  { value: "government-dfi", label: "Government or DFI collaboration" },
  { value: "inaccurate-information", label: "Report inaccurate project information" },
  { value: "technical-support", label: "Technical support" },
];

export default function ContactForm({ initialTopic = "general", projectId, locale }: { initialTopic?: string; projectId?: string; locale: Locale }) {
  const ui = investmentUi(locale).contact;
  const legalUi = contactLegalAcknowledgement(locale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [topic, setTopic] = useState(TOPICS.some((item) => item.value === initialTopic) ? initialTopic : "general");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, organization, topic, message: projectId ? `[Project: ${projectId}]\n${message}` : message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? ui.retry);
        return;
      }
      trackProductEvent("contact_submitted", { topic });
      setSent(true);
    } catch {
      setError(ui.network);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center shadow-[0_12px_32px_rgb(0_0_0/0.35)]">
        <div className="w-12 h-12 rounded-full bg-gold-soft text-gold flex items-center justify-center mx-auto mb-4 text-xl">
          ✓
        </div>
        <h2 className="font-display font-bold text-xl text-charcoal">{ui.received}</h2>
        <p className="text-wgray text-sm mt-2">
          {ui.receivedBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl p-8 shadow-[0_12px_32px_rgb(0_0_0/0.35)] space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">
            {ui.fullName}
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">
            {ui.email}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>
      <div>
        <label htmlFor="organization" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">
          {ui.organization} <span className="normal-case font-normal text-wgray/70">({ui.optional})</span>
        </label>
        <input
          id="organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold"
        />
      </div>
      <div>
        <label htmlFor="topic" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">
          {ui.topic}
        </label>
        <select
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold"
        >
          {TOPICS.map((topicOption) => (
            <option key={topicOption.value} value={topicOption.value}>{ui.topics[topicOption.value]}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">
          {ui.message}
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold resize-none"
        />
      </div>
      {error && (
        <div role="alert" className="text-xs text-brandred bg-brandred/10 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <label className="flex items-start gap-3 rounded-xl border border-charcoal/10 bg-mist p-3 text-xs leading-5 text-slate">
        <input
          type="checkbox"
          required
          checked={acknowledged}
          onChange={(event) => setAcknowledged(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-gold"
        />
        <span>
          {legalUi.acknowledgement}{" "}
          <Link href="/legal" className="font-bold text-ink underline underline-offset-2">{legalUi.legalStatus}</Link>.
        </span>
      </label>
      <button
        disabled={busy || !acknowledged}
        className="w-full bg-gold text-ink font-display font-bold py-3.5 rounded-xl hover:brightness-110 disabled:opacity-60"
      >
        {busy ? ui.sending : ui.send}
      </button>
    </form>
  );
}
