"use client";

import { useEffect, useState } from "react";

type Requester = {
  userId: string;
  fullName: string;
  email: string;
  requestedAt: string;
  granted: boolean;
  revoked: boolean;
  grantedAt: string | null;
};
type LogEntry = { id: string; documentName: string; userFullName: string; userEmail: string; createdAt: string };

export default function DataRoomAccessPanel({ listingId }: { listingId: string }) {
  const [requesters, setRequesters] = useState<Requester[] | null>(null);
  const [logs, setLogs] = useState<LogEntry[] | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const [reqRes, logRes] = await Promise.all([
      fetch("/api/listings/" + listingId + "/dataroom"),
      fetch("/api/listings/" + listingId + "/dataroom/log"),
    ]);
    if (reqRes.ok) setRequesters((await reqRes.json()).requesters);
    if (logRes.ok) setLogs((await logRes.json()).logs);
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const grant = async (userId: string) => {
    await fetch("/api/listings/" + listingId + "/dataroom", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    await load();
  };

  const revoke = async (userId: string) => {
    await fetch("/api/listings/" + listingId + "/dataroom?userId=" + userId, { method: "DELETE" });
    await load();
  };

  return (
    <div className="mt-4 pt-4 border-t border-charcoal/10">
      <button onClick={() => setOpen((o) => !o)} className="text-xs font-bold text-gold">
        {open ? "Hide" : "Manage"} data-room access
      </button>
      {open && (
        <div className="mt-3 space-y-4">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Access requests</h3>
            {requesters === null ? (
              <p className="text-xs text-wgray">Loading…</p>
            ) : requesters.length === 0 ? (
              <p className="text-xs text-wgray">No investor has requested data-room access yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {requesters.map((r) => (
                  <li key={r.userId} className="flex items-center justify-between text-sm py-1.5 px-2 rounded-lg bg-mist">
                    <span>
                      <span className="font-semibold">{r.fullName}</span>
                      <span className="text-wgray text-xs ml-2">{r.email}</span>
                    </span>
                    {r.granted ? (
                      <button onClick={() => revoke(r.userId)} className="text-[11px] font-bold text-brandred">Revoke</button>
                    ) : (
                      <button onClick={() => grant(r.userId)} className="text-[11px] font-bold text-emerald-p">Grant access</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Download log</h3>
            {logs === null ? (
              <p className="text-xs text-wgray">Loading…</p>
            ) : logs.length === 0 ? (
              <p className="text-xs text-wgray">No downloads recorded yet.</p>
            ) : (
              <ul className="space-y-1 text-xs text-wgray">
                {logs.map((l) => (
                  <li key={l.id}>
                    <span className="font-semibold text-charcoal">{l.userFullName}</span> downloaded{" "}
                    <span className="font-semibold text-charcoal">{l.documentName}</span> · {new Date(l.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
