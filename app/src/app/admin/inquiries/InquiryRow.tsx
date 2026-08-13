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
  locale: string;
  sourcePath: string;
  retentionEndsAt: string | Date | null;
  acknowledgedAt: string | Date | null;
  crmContact: { id: string; owner: { fullName: string } | null } | null;
  crmOpportunity: { id: string; name: string; stage: string } | null;
  project: { title: string } | null;
  createdAt: string | Date;
};

const STATUSES = ["new", "read", "triaged", "qualified", "converted", "closed", "spam"];

export default function InquiryRow({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const setStatus = async (status: string) => {
    setBusy(true);
    await fetch("/api/contact/" + inquiry.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setBusy(false);
  };

  return (
    <div className="bg-white  p-5 ">
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
          <select
            value={inquiry.status}
            onChange={(event) => void setStatus(event.target.value)}
            disabled={busy}
            aria-label={`Status for ${inquiry.name}`}
            className="mt-1  border border-charcoal/10 bg-mist px-2 py-1 text-xs font-bold"
          >
            {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      </div>
      <p className="text-sm text-charcoal/80 mt-3 leading-relaxed whitespace-pre-wrap">
        {inquiry.message}
      </p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-charcoal/10 pt-3 text-[11px] text-wgray">
        <span>Locale: {inquiry.locale}</span>
        <span>Source: {inquiry.sourcePath}</span>
        {inquiry.project && <span>Project: {inquiry.project.title}</span>}
        {inquiry.crmContact?.owner && <span>Owner: {inquiry.crmContact.owner.fullName}</span>}
        {inquiry.acknowledgedAt && <span>Notice acknowledged: {new Date(inquiry.acknowledgedAt).toLocaleDateString()}</span>}
        {inquiry.retentionEndsAt && <span>Retention review: {new Date(inquiry.retentionEndsAt).toLocaleDateString()}</span>}
        {inquiry.crmContact && <a href="/admin/crm" className="font-bold text-gold">Open CRM contact</a>}
        {inquiry.crmOpportunity && <a href="/admin/crm" className="font-bold text-gold">Opportunity: {inquiry.crmOpportunity.name} ({inquiry.crmOpportunity.stage})</a>}
      </div>
    </div>
  );
}
