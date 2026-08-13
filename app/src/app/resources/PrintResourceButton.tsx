"use client";

import Button from "@/components/ui/Button";

export default function PrintResourceButton({ label }: { label: string }) {
  return (
    <Button type="button" onClick={() => window.print()} className="button-secondary print:hidden">
      {label}
    </Button>
  );
}
