"use client";

import { useState } from "react";
import Link from "next/link";
import { trackProductEvent } from "@/components/ProductAnalytics";
import type { Locale } from "@/lib/i18n";
import { CONTACT_NOTICE_VERSION } from "@/lib/legal-consent";
import {
  CAMPAIGN_STORAGE_KEY,
  campaignAttributionFromSearch,
  hasCampaignAttribution,
  parseStoredCampaignAttribution,
} from "@/lib/marketing-attribution";
import {
  contactCollectionPaused,
  contactEmailFallback,
  contactLegalAcknowledgement,
  investmentUi,
} from "@/lib/translations/investment-ui";
import { releaseReadinessCopy } from "@/lib/translations/release-readiness";

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

export default function ContactForm({
  initialTopic = "general",
  projectId,
  locale,
  collectionEnabled,
}: {
  initialTopic?: string;
  projectId?: string;
  locale: Locale;
  collectionEnabled: boolean;
}) {
  const ui = investmentUi(locale).contact;
  const legalUi = contactLegalAcknowledgement(locale);
  const readiness = releaseReadinessCopy(locale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [topic, setTopic] = useState(TOPICS.some((item) => item.value === initialTopic) ? initialTopic : "general");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [started, setStarted] = useState(false);
  const [requestKey] = useState(() => crypto.randomUUID());

  const markStarted = () => {
    if (started) return;
    setStarted(true);
    trackProductEvent("contact_started", { topic, locale, hasProject: Boolean(projectId) });
  };

  if (!collectionEnabled) {
    return (
      <div className="rounded-3xl border border-gold/30 bg-white p-8 text-charcoal shadow-[0_12px_32px_rgb(0_0_0/0.35)]">
        <p className="text-sm leading-7">{contactCollectionPaused(locale)}</p>
        <p className="mt-4 rounded-xl border border-charcoal/10 bg-mist p-4 text-xs leading-5 text-slate">
          {readiness.contactProcess}
        </p>
        <a
          href={`mailto:support@desco.global?subject=${encodeURIComponent(ui.topics[topic] ?? ui.topics.general)}${projectId ? `&body=${encodeURIComponent(`Project: ${projectId}`)}` : ""}`}
          className="button-primary mt-6"
        >
          {contactEmailFallback(locale)}
        </a>
        <Link href="/legal" className="button-secondary mt-6">
          {legalUi.legalStatus}
        </Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const currentCampaign = campaignAttributionFromSearch(window.location.search);
      const storedCampaign = parseStoredCampaignAttribution(
        window.sessionStorage.getItem(CAMPAIGN_STORAGE_KEY),
      );
      const campaign = hasCampaignAttribution(currentCampaign) ? currentCampaign : storedCampaign;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          organization,
          topic,
          message,
          projectId,
          locale,
          sourcePath: window.location.pathname,
          referrer: document.referrer,
          campaignSource: campaign?.source,
          campaignMedium: campaign?.medium,
          campaignName: campaign?.campaign,
          requestKey,
          acknowledgedContactNotice: acknowledged,
          contactNoticeVersion: CONTACT_NOTICE_VERSION,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.code === "RATE_LIMITED" ? ui.retry : ui.retry);
        trackProductEvent("contact_error", { topic, locale, status: res.status });
        return;
      }
      trackProductEvent("contact_submitted", { topic, locale, hasProject: Boolean(projectId) });
      if (topic === "investor-access" || topic === "data-room") {
        trackProductEvent("access_requested", { topic, locale, hasProject: Boolean(projectId) });
      }
      setSent(true);
    } catch {
      setError(ui.network);
      trackProductEvent("contact_error", { topic, locale, status: "network" });
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
    <form onSubmit={submit} onFocus={markStarted} className="bg-white rounded-3xl p-8 shadow-[0_12px_32px_rgb(0_0_0/0.35)] space-y-4">
      <p className="rounded-xl border border-charcoal/10 bg-mist p-4 text-xs leading-5 text-slate">
        {readiness.contactProcess}
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-wgray mb-1.5">
            {ui.fullName}
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-wgray mb-1.5">
            {ui.email}
          </label>
          <input
            id="email"
            name="email"
            autoComplete="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>
      <div>
        <label htmlFor="organization" className="block text-xs font-bold uppercase tracking-wider text-wgray mb-1.5">
          {ui.organization} <span className="normal-case font-normal text-wgray/70">({ui.optional})</span>
        </label>
        <input
          id="organization"
          name="organization"
          autoComplete="organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="w-full bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold"
        />
      </div>
      <div>
        <label htmlFor="topic" className="block text-xs font-bold uppercase tracking-wider text-wgray mb-1.5">
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
        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-wgray mb-1.5">
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
