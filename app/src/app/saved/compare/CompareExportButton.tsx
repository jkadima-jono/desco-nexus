"use client";

type ListingRow = { id: string; title: string; raiseUsd: number; instrument: string; country: string; flag: string; stage: string; irr: string; verified: boolean; risk: number; esg: number; useOfFunds?: string | null; sponsorContributionUsd?: number | null; fundingSecuredUsd?: number | null };

const NOT_DISCLOSED = "Not disclosed";

const csvCell = (v: string): string => '"' + v.replace(/"/g, '""') + '"';

export default function CompareExportButton({ listings, rows }: { listings: ListingRow[]; rows: string[] }) {
  const download = () => {
    const values: Record<string, (l: ListingRow) => string> = {
      "Capital required": (l) => "$" + l.raiseUsd.toLocaleString(),
      "Instrument": (l) => l.instrument,
      "Geography": (l) => l.country,
      "Stage": (l) => l.stage,
      "Revenue model": () => NOT_DISCLOSED,
      "Use of funds": (l) => l.useOfFunds || NOT_DISCLOSED,
      "Sponsor contribution": (l) => l.sponsorContributionUsd != null ? "$" + l.sponsorContributionUsd.toLocaleString() : NOT_DISCLOSED,
      "Funding secured": (l) => l.fundingSecuredUsd != null ? "$" + l.fundingSecuredUsd.toLocaleString() : NOT_DISCLOSED,
      "Return information": (l) => l.irr || NOT_DISCLOSED,
      "Timetable": () => NOT_DISCLOSED,
      "Evidence review": (l) => (l.verified ? "DESCO evidence review recorded; inspect scope" : "Independent verification not recorded"),
      "Principal risks": () => NOT_DISCLOSED,
      "Evidence source date": () => "Source date not disclosed on the public record",
    };
    const header = ["Field", ...listings.map((l) => l.title)].map(csvCell).join(",");
    const lines = rows.map((label) => [label, ...listings.map((l) => values[label]?.(l) ?? NOT_DISCLOSED)].map(csvCell).join(","));
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexus-comparison.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (listings.length === 0) return null;

  return (
    <button onClick={download} className="text-xs font-bold bg-charcoal text-white px-4 py-2 rounded-lg self-start">
      Export CSV
    </button>
  );
}
