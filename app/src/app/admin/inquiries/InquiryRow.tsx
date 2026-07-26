"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  topic: string;
  message: string;
  status: string;
  createdAt: string | Date;
};

export default function InquiryRow({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    const next = inquiry.status === "new" ? "read" : "new";
    await fetch("/api/contact/" + inquiry.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
    setBusy(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm">{inquiry.name}</span>
            <span className="text-[11px] text-wgray">{inquiry.email}</span>
            {inquiry.organization && (
              <span className="text-[11px] text-wgray">· {inquiry.organization}</span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold mt-1 inline-block">
            {inquiry.topic}
          </span>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[11px] text-wgray">
            {new Date(inquiry.createdAt).toLocaleDateString()}
          </div>
          <button
            onClick={toggle}
            disabled={busy}
            className={
              "mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full " +
              (inquiry.status === "new" ? "bg-gold text-ink" : "bg-mist text-wgray")
            }
          >
            {inquiry.status}
          </button>
        </div>
      </div>
      <p className="text-sm text-charcoal/80 mt-3 leading-relaxed whitespace-pre-wrap">
        {inquiry.message}
      </p>
    </div>
  );
}
