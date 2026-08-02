"use client";

export default function PrintResourceButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="button-secondary print:hidden">
      {label}
    </button>
  );
}
