"use client";

type ListingRow = { id: string; title: string; raiseUsd: number; instrument: string; country: string; flag: string; stage: string; irr: string; verified: boolean; risk: number; esg: number };

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
      "Sponsor contribution": () => NOT_DISCLOSED,
      "Return information": (l) => l.irr || NOT_DISCLOSED,
      "Timetable": () => NOT_DISCLOSED,
      "Verification": (l) => (l.verified ? "Verified" : "Not yet verified"),
      "Risks": (l) => (l.risk ? "Risk score " + l.risk + "/100" : NOT_DISCLOSED),
      "ESG information": (l) => (l.esg ? "ESG score " + l.esg + "/100" : NOT_DISCLOSED),
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
