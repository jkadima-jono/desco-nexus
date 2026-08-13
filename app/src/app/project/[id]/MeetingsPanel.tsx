"use client";

import Button from "@/components/ui/Button";

import { useEffect, useState } from "react";
import { RESTRICTED_ACCESS_NOTICE_VERSION } from "@/lib/restricted-access";

type Meeting = {
  id: string;
  requesterName: string;
  requesterEmail: string;
  proposedSlots: string[];
  note: string;
  status: "requested" | "confirmed" | "declined" | "cancelled";
  confirmedSlot: string | null;
  createdAt: string;
};

const fmt = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function MeetingsPanel({ listingId, canManage }: { listingId: string; canManage: boolean }) {
  const [meetings, setMeetings] = useState<Meeting[] | null>(null);
  const [slots, setSlots] = useState(["", "", ""]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      const res = await fetch("/api/meetings?listingId=" + listingId);
      if (!res.ok) {
        setError("Meeting requests could not be loaded.");
        return;
      }
      setMeetings((await res.json()).meetings);
    } catch {
      setError("Meeting requests could not be loaded.");
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    const proposedSlots = slots.map((s) => s.trim()).filter(Boolean).map((s) => new Date(s).toISOString());
    if (proposedSlots.length === 0) return;
    if (!window.confirm("This is a non-binding meeting request. It is not an offer, commitment or grant of access. Continue and record this acknowledgement?")) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          proposedSlots,
          note,
          acknowledgedRestrictedAccess: true,
          noticeVersion: RESTRICTED_ACCESS_NOTICE_VERSION,
        }),
      });
      if (res.ok) {
        setSlots(["", "", ""]);
        setNote("");
        await load();
      } else {
        setError("The meeting request could not be sent.");
      }
    } catch {
      setError("The meeting request could not be sent.");
    } finally {
      setSubmitting(false);
    }
  };

  const respond = async (id: string, status: "confirmed" | "declined" | "cancelled", confirmedSlot?: string) => {
    setError(null);
    try {
      const res = await fetch("/api/meetings/" + id, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, confirmedSlot }),
      });
      if (!res.ok) {
        setError("The meeting response could not be saved.");
        return;
      }
      await load();
    } catch {
      setError("The meeting response could not be saved.");
    }
  };

  return (
    <div className="space-y-4">
          {error && (
            <div role="alert" className="flex items-center justify-between gap-3  bg-brandred/10 px-3 py-2 text-xs text-brandred">
              <span>{error}</span>
              <Button type="button" onClick={load} className="min-h-11 font-bold underline">Retry</Button>
            </div>
          )}
          {!canManage && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-wgray">Propose times</h3>
              {slots.map((s, i) => (
                <input
                  key={i}
                  type="datetime-local"
                  value={s}
                  onChange={(e) => setSlots((arr) => arr.map((v, j) => (j === i ? e.target.value : v)))}
                  aria-label={"Proposed time " + (i + 1)}
                  className="w-full bg-mist  px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-gold"
                />
              ))}
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note (agenda, attendees…)"
                rows={2}
                className="w-full bg-mist  px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-gold resize-none"
              />
              <Button
                onClick={submit}
                disabled={submitting || slots.every((s) => !s.trim())}
                className="text-xs font-bold bg-gold text-ink px-4 py-2  disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Send request"}
              </Button>
            </div>
          )}

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">
              {canManage ? "Meeting requests" : "Your requests"}
            </h3>
            {meetings === null ? (
              <p className="text-xs text-wgray">Loading…</p>
            ) : meetings.length === 0 ? (
              <p className="text-xs text-wgray">No meeting requests yet.</p>
            ) : (
              <ul className="space-y-2">
                {meetings.map((m) => (
                  <li key={m.id} className="text-sm py-2 px-3  bg-mist">
                    {canManage && <div className="font-semibold text-xs">{m.requesterName} <span className="text-wgray">{m.requesterEmail}</span></div>}
                    {m.note && <div className="text-xs text-wgray mt-0.5">{m.note}</div>}
                    <div className="text-[11px] font-bold uppercase tracking-wider mt-1.5 mb-1">
                      {m.status === "confirmed" && m.confirmedSlot
                        ? "Confirmed — " + fmt(m.confirmedSlot)
                        : m.status}
                    </div>
                    {m.status === "requested" && canManage && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.proposedSlots.map((s) => (
                          <Button
                            key={s}
                            onClick={() => respond(m.id, "confirmed", s)}
                            className="text-[11px] font-bold bg-emerald-p/10 text-emerald-p px-2 py-1 "
                          >
                            Confirm {fmt(s)}
                          </Button>
                        ))}
                        <Button onClick={() => respond(m.id, "declined")} className="text-[11px] font-bold text-brandred px-2 py-1">Decline</Button>
                      </div>
                    )}
                    {m.status === "requested" && !canManage && (
                      <Button onClick={() => respond(m.id, "cancelled")} className="text-[11px] font-bold text-brandred">Cancel request</Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
    </div>
  );
}
