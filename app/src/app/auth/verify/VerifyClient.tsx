"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
import { accountCopy } from "@/lib/translations/account";
import { sanitizeNextPath } from "@/lib/nextParam";

export default function VerifyClient({ enabled }: { enabled: boolean }) {
  return <Suspense fallback={null}><Verify enabled={enabled} /></Suspense>;
}

function Verify({ enabled }: { enabled: boolean }) {
  const { locale } = useI18n();
  const copy = accountCopy(locale);
  const params = useSearchParams();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [destination, setDestination] = useState("/");
  const [token, setToken] = useState("");
  const next = sanitizeNextPath(params.get("next"));

  // The bearer token is needed only in memory. Remove it from address-bar
  // history immediately so it is not copied, bookmarked or exposed later.
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    setToken(fragment.get("token") ?? "");
    router.replace(next === "/" ? "/auth/verify" : `/auth/verify?next=${encodeURIComponent(next)}`);
  }, [next, router]);

  const confirm = async () => {
    if (!token || !enabled) { setError(copy.verifyError); return; }
    setBusy(true); setError(null);
    try {
      const response = await fetch("/api/auth/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, next }) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) { setError(copy.verifyError); return; }
      setDestination(sanitizeNextPath(body.next)); setVerified(true); router.refresh();
    } catch { setError(copy.verifyError); } finally { setBusy(false); }
  };

  return <div className="min-h-screen bg-ink px-6 py-16 text-white"><div className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 text-charcoal shadow-2xl sm:p-8">
    {verified ? <div role="status" aria-live="polite" className="text-center"><div aria-hidden="true" className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-gold-soft">✓</div><h1 className="font-display text-xl font-bold">{copy.verifiedTitle}</h1><p className="mt-3 text-sm text-wgray">{copy.verifiedBody}</p><Link href={destination} className="button-primary mt-6 w-full">{copy.continue}</Link></div> : <><h1 className="font-display text-xl font-bold">{copy.verifyTitle}</h1><p className="mt-3 text-sm leading-6 text-wgray">{copy.verifyIntro}</p>{error && <div role="alert" className="mt-4 rounded-lg bg-brandred/10 px-3 py-2 text-sm text-brandred">{error}</div>}<button type="button" onClick={confirm} disabled={busy || !token || !enabled} className="button-primary mt-6 w-full disabled:opacity-60">{busy ? copy.verifying : copy.verifyButton}</button><Link href="/login" className="mt-4 block min-h-11 py-3 text-center text-sm font-bold underline underline-offset-4">{copy.signIn}</Link></>}
  </div></div>;
}
