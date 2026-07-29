"use client";

const csvCell = (v: string): string => '"' + v.replace(/"/g, '""') + '"';

export default function CompareExportButton({ titles, rows, label }: { titles: string[]; rows: { label: string; values: string[] }[]; label: string }) {
  const download = () => {
    const header = ["", ...titles].map(csvCell).join(",");
    const lines = rows.map((row) => [row.label, ...row.values].map(csvCell).join(","));
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "desco-compass-comparison.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (titles.length === 0) return null;

  return (
    <button onClick={download} className="text-xs font-bold bg-charcoal text-white px-4 py-2 rounded-lg self-start">
      {label}
    </button>
  );
}
