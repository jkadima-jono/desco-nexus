"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type PreviewOpportunity = {
  id: string;
  title: string;
  sector: string;
  stage: string;
  instrument: string;
  href: string;
};

type PreviewCopy = {
  title: string;
  instruction: string;
  sector: string;
  stage: string;
  instrument: string;
  all: string;
  resultOne: string;
  resultMany: string;
  empty: string;
  capitalNote: string;
  review: string;
};

export default function InvestorMandatePreview({ opportunities, copy }: { opportunities: PreviewOpportunity[]; copy: PreviewCopy }) {
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState("");
  const [instrument, setInstrument] = useState("");
  const sectors = [...new Set(opportunities.map((item) => item.sector))];
  const stages = [...new Set(opportunities.map((item) => item.stage))];
  const instruments = [...new Set(opportunities.map((item) => item.instrument))];
  const matches = useMemo(
    () => opportunities.filter((item) =>
      (!sector || item.sector === sector) &&
      (!stage || item.stage === stage) &&
      (!instrument || item.instrument === instrument)),
    [instrument, opportunities, sector, stage],
  );

  return (
    <div className="briefing-card">
      <p className="eyebrow text-gold">{copy.title}</p>
      <p className="mt-3 text-sm leading-6 text-slate">{copy.instruction}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          [copy.sector, sector, setSector, sectors],
          [copy.stage, stage, setStage, stages],
          [copy.instrument, instrument, setInstrument, instruments],
        ].map(([label, value, setter, options]) => (
          <label key={String(label)} className="text-xs font-bold text-ink">
            {String(label)}
            <select
              value={String(value)}
              onChange={(event) => (setter as (value: string) => void)(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-ink/15 bg-white px-3 text-sm font-medium text-ink"
            >
              <option value="">{copy.all}</option>
              {(options as string[]).map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        ))}
      </div>
      <div aria-live="polite" className="mt-5 border-t border-ink/10 pt-4">
        <p className="text-sm font-bold text-ink">
          {(matches.length === 1 ? copy.resultOne : copy.resultMany).replace("{count}", String(matches.length))}
        </p>
        {matches.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {matches.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 border-b border-ink/8 pb-2 text-xs">
                <span><strong className="text-ink">{item.title}</strong><span className="mt-1 block text-slate">{item.sector} · {item.stage}</span></span>
                <Link href={item.href} className="shrink-0 font-bold text-ink underline decoration-gold underline-offset-4">{copy.review}</Link>
              </li>
            ))}
          </ul>
        ) : <p className="mt-2 text-xs leading-5 text-slate">{copy.empty}</p>}
        <p className="mt-4 text-xs leading-5 text-slate">{copy.capitalNote}</p>
      </div>
    </div>
  );
}
