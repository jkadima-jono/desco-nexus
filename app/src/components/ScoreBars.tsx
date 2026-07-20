"use client";

import type { Scores } from "@/lib/data";
import { useI18n } from "./I18nProvider";

const rows = (s: Scores) => [
  { key: "scores.readiness", value: s.readiness, color: "#B8953D" },
  { key: "scores.esg", value: s.esg, color: "#00A550" },
  { key: "scores.risk", value: s.risk, color: "#C41E3A" },
];

export default function ScoreBars({ scores }: { scores: Scores }) {
  const { t } = useI18n();
  return (
    <div className="space-y-1.5">
      {rows(scores).map((r) => (
        <div key={r.key} className="flex items-center gap-2 text-[11px]">
          <span className="w-16 text-wgray font-semibold">{t(r.key)}</span>
          <div className="flex-1 h-1.5 rounded-full bg-[#EDEFF2] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: r.value + "%", background: r.color }}
            />
          </div>
          <span className="w-6 text-right font-semibold">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
