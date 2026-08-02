"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Copy = { signOut: string; signOutAll: string; exportData: string; deleteAccount: string; unavailableAction: string; requestReceived: string };

export default function AccountActions({ copy }: { copy: Copy }) {
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const signOut = async () => { setBusy(true); await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); };
  const accountAction = async (action: "sign_out_all" | "data_export" | "account_deletion") => {
    setBusy(true); setNotice(null);
    try {
      const response = await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
      if (!response.ok) { setNotice(copy.unavailableAction); return; }
      if (action === "sign_out_all") { router.push("/"); router.refresh(); return; }
      setNotice(copy.requestReceived);
    } catch { setNotice(copy.unavailableAction); } finally { setBusy(false); }
  };
  return <div className="mt-6 space-y-3"><button type="button" onClick={signOut} disabled={busy} className="button-primary w-full disabled:opacity-60 sm:w-auto">{copy.signOut}</button><div className="grid gap-3 border-t border-charcoal/10 pt-6 sm:grid-cols-3"><button type="button" disabled={busy} onClick={() => accountAction("sign_out_all")} className="button-secondary w-full disabled:opacity-60" aria-describedby="account-action-status">{copy.signOutAll}</button><button type="button" disabled={busy} onClick={() => accountAction("data_export")} className="button-secondary w-full disabled:opacity-60" aria-describedby="account-action-status">{copy.exportData}</button><button type="button" disabled={busy} onClick={() => accountAction("account_deletion")} className="button-secondary w-full disabled:opacity-60" aria-describedby="account-action-status">{copy.deleteAccount}</button></div><p id="account-action-status" role="status" aria-live="polite" className="min-h-6 text-sm leading-6 text-wgray">{notice}</p></div>;
}
