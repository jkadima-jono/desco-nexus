import type { Locale } from "@/lib/i18n";
import type { InvestmentEvidence } from "@/lib/investment-evidence";
import { summarizeEvidence } from "@/lib/investment-evidence";
import { disclosureCompletenessCopy } from "@/lib/translations/investment-ui";

export default function DisclosureCompleteness({
  evidence,
  locale,
  compact = false,
}: {
  evidence: InvestmentEvidence;
  locale: Locale;
  compact?: boolean;
}) {
  const summary = summarizeEvidence(evidence);
  const copy = disclosureCompletenessCopy(locale);
  const missing = evidence.fields
    .filter((field) => field.status === "not-disclosed")
    .map((field) => field.label);
  const detail = missing.length > 0 ? `${copy.missing}: ${missing.join(", ")}` : copy.noneMissing;

  return (
    <div className={compact ? "min-w-0" : "w-full"} title={detail}>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-charcoal">
          {copy.count(summary.supported, summary.total)}
        </span>
        <span className="shrink-0 text-wgray">{copy.review}</span>
      </div>
      <div
        className="mt-2 grid h-1.5 gap-0.5 overflow-hidden rounded-full"
        style={{ gridTemplateColumns: `repeat(${Math.max(summary.total, 1)}, minmax(0, 1fr))` }}
        aria-label={`${copy.count(summary.supported, summary.total)}. ${detail}`}
      >
        {evidence.fields.map((field) => (
          <span
            key={field.label}
            className={
              field.status === "disclosed"
                ? "bg-teal"
                : field.status === "partial"
                  ? "bg-gold"
                  : "bg-charcoal/12"
            }
          />
        ))}
      </div>
      {!compact && <p className="mt-2 text-xs leading-5 text-wgray">{detail}</p>}
    </div>
  );
}
