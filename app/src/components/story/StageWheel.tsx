const STAGES = [
  { key: "discover", label: "Discover" },
  { key: "match", label: "Match" },
  { key: "room", label: "Data Room" },
  { key: "portfolio", label: "Portfolio" },
  { key: "reporting", label: "Reporting" },
];

export default function StageWheel({ active }: { active: string }) {
  const { t } = useI18n();
  return (
    <div
      className="flex items-center gap-1.5 overflow-x-auto pb-1"
      role="group"
      aria-label={t("stages.lifecycle")}
    >
      {STAGES.map((s, i) => {
        const isActive = s.key === active;
        const isPast = STAGES.findIndex((x) => x.key === active) > i;
        return (
          <div key={s.key} className="flex items-center shrink-0">
            <span
              aria-current={isActive ? "step" : undefined}
              className={
                "text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap " +
                (isActive
                  ? "bg-gold text-ink"
                  : isPast
                  ? "bg-gold-soft text-gold"
                  : "bg-mist text-wgray")
              }
            >
              {s.label}
            </span>
            {i < STAGES.length - 1 && <span className="text-charcoal/20 mx-1">→</span>}
          </div>
        );
      })}
    </div>
  );
}
"use client";

import { useI18n } from "@/components/I18nProvider";
