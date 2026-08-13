"use client";

import Button from "@/components/ui/Button";

import { useState } from "react";
import { capitalPresentation, type Listing } from "@/lib/data";
import { useI18n } from "@/components/I18nProvider";
import HeroVisual from "@/components/HeroVisual";
import SectorBadge from "@/components/SectorBadge";
import { evidenceDisclosureStatus, getInvestmentEvidence, summarizeEvidence } from "@/lib/investment-evidence";
import { disclosureStatusCopy } from "@/lib/translations/investment-ui";

type Verdict = "interested" | "pass" | "saved";

export default function MatchFlow({ queue }: { queue: Listing[] }) {
  const { locale, t } = useI18n();
  const [idx, setIdx] = useState(0);
  const [log, setLog] = useState<{ title: string; verdict: Verdict; deal?: boolean }[]>([]);
  const [leaving, setLeaving] = useState<Verdict | null>(null);
  const [error, setError] = useState<string | null>(null);

  const current = queue[idx];
  const evidence = current ? summarizeEvidence(getInvestmentEvidence(current)) : null;
  const disclosureStatus = evidence
    ? disclosureStatusCopy(locale, evidenceDisclosureStatus(evidence))
    : "";
  const capital = current ? capitalPresentation(current) : null;

  const act = async (verdict: Verdict) => {
    if (!current || leaving) return;
    setLeaving(verdict);
    setError(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: current.id, action: verdict, requestKey: crypto.randomUUID() }),
      });
      if (!res.ok) throw new Error("Request failed: " + res.status);
      const data: { dealCreated?: boolean } = await res.json();
      setTimeout(() => {
        setLog((l) => [
          { title: current.title, verdict, deal: data.dealCreated },
          ...l,
        ]);
        setIdx((i) => i + 1);
        setLeaving(null);
      }, 220);
    } catch {
      setLeaving(null);
      setError(t("match.error"));
    }
  };

  const leaveClass =
    leaving === "interested"
      ? "translate-x-40 rotate-6 opacity-0"
      : leaving === "pass"
      ? "-translate-x-40 -rotate-6 opacity-0"
      : leaving === "saved"
      ? "-translate-y-40 opacity-0"
      : "";

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight">
        {t("match.title")}
      </h1>
      <p className="text-wgray text-sm mt-1 mb-6">{t("match.subtitle")}</p>

      {error && (
        <div className="mb-4 bg-brandred/10 border-l-4 border-brandred  px-4 py-3 text-sm text-brandred">
          {error}
        </div>
      )}

      {current ? (
        <div
          className={
            "bg-white   overflow-hidden transition-all duration-200 " +
            leaveClass
          }
        >
          <div className="relative">
            <HeroVisual listing={current} className="h-52" />
            <div className="absolute top-4 right-4">
              <SectorBadge sector={current.sector} size={36} />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white ">
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-90">
                {current.sector} · {current.flag} {current.country}
              </div>
              <div className="font-display font-extrabold text-2xl">
                {current.title}
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-charcoal/80 leading-relaxed">{current.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-slate">
              <span className=" border border-charcoal/15 bg-mist px-2.5 py-1">
                {disclosureStatus}
              </span>
            </div>
            <div className="flex items-center gap-6 mt-5">
              <div>
                <div className="font-display font-extrabold text-2xl">
                  {capital?.value}
                </div>
                <div className="text-[11px] text-wgray">{current.instrument}</div>
              </div>
              <div className="text-[11px] text-wgray">
                {current.stage}
                {current.governmentBacked && " · ◆ Government involvement"}
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-7">
              <Button
                onClick={() => act("pass")}
                className="w-32 py-3  border-2 border-brandred/30 text-brandred font-display font-bold hover:bg-brandred hover:text-white transition-colors"
              >
                ✕ {t("match.pass")}
              </Button>
              <Button
                onClick={() => act("saved")}
                className="w-32 py-3  border-2 border-charcoal/20 text-charcoal font-display font-bold hover:bg-charcoal hover:text-white transition-colors"
              >
                ⌁ {t("match.save")}
              </Button>
              <Button
                onClick={() => act("interested")}
                className="w-40 py-3  bg-gold text-ink font-display font-bold hover:brightness-110 "
              >
                ★ {t("match.interested")}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white  p-12 text-center ">
          <div className="font-display font-extrabold text-2xl mb-2">
            {t("match.done")}
          </div>
          <p className="text-wgray text-sm">{t("match.doneSub")}</p>
        </div>
      )}

      {log.length > 0 && (
        <div className="mt-8">
          <div className="text-[11px] font-bold text-wgray uppercase tracking-wider mb-2">
            {t("match.session")}
          </div>
          <div className="space-y-1.5">
            {log.map((e, i) => (
              <div
                key={i}
                className="flex justify-between bg-white  px-4 py-2.5 text-sm "
              >
                <span className="truncate">
                  {e.title}
                  {e.deal && (
                    <span className="ml-2 text-[10px] font-bold text-gold uppercase">
                      → {t("match.dealOpened")}
                    </span>
                  )}
                </span>
                <span
                  className={
                    "font-bold " +
                    (e.verdict === "interested"
                      ? "text-gold"
                      : e.verdict === "pass"
                      ? "text-brandred"
                      : "text-charcoal")
                  }
                >
                  {e.verdict}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
