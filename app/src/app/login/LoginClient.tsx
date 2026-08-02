"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
import { sanitizeNextPath } from "@/lib/nextParam";
import { sharedCopy } from "@/lib/translations/shared";
import { accountCopy } from "@/lib/translations/account";

const PERSONAS = [
  { id: "investor", labelKey: "login.demoInvestor", icon: "◈" },
  { id: "owner", labelKey: "login.demoOwner", icon: "▲" },
  { id: "advisor", labelKey: "login.demoAdvisor", icon: "✦" },
  { id: "admin", labelKey: "login.demoAdmin", icon: "⚙" },
];

export default function Login({ demoEnabled, adminEnabled, signupEnabled, accessEnabled, mode = "login" }: {
  demoEnabled: boolean;
  adminEnabled: boolean;
  signupEnabled: boolean;
  accessEnabled: boolean;
  mode?: "login" | "signup";
}) {
  return <Suspense fallback={<div role="status" className="min-h-screen bg-ink" aria-label="Loading secure access" />}><LoginForm demoEnabled={demoEnabled} adminEnabled={adminEnabled} signupEnabled={signupEnabled} accessEnabled={accessEnabled} mode={mode} /></Suspense>;
}

function LoginForm({ demoEnabled, adminEnabled, signupEnabled, accessEnabled, mode }: {
  demoEnabled: boolean;
  adminEnabled: boolean;
  signupEnabled: boolean;
  accessEnabled: boolean;
  mode: "login" | "signup";
}) {
  const { locale, t } = useI18n();
  const copy = sharedCopy(locale);
  const account = accountCopy(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = sanitizeNextPath(searchParams.get("next"));
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const enterDemo = async (persona: string) => {
    setBusy(persona); setError(null);
    try {
      const res = await fetch("/api/auth/demo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ persona }) });
      if (!res.ok) { const data = await res.json().catch(() => ({})); setError(data.error ?? "Sign-in failed"); return; }
      router.push(next); router.refresh();
    } catch { setError("Network error — retry."); } finally { setBusy(null); }
  };

  const requestLink = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy("email"); setError(null);
    try {
      const payload = mode === "signup" ? { email, fullName, acceptedTerms, next, locale } : { email, next, locale };
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok && res.status !== 202) { setError(account.verifyError); return; }
      setSent(true);
    } catch { setError(account.verifyError); } finally { setBusy(null); }
  };

  const switchHref = `${mode === "signup" ? "/login" : "/signup"}${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" aria-label="Return to DESCO Compass home" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}<img src="/brand/desco-compass-logo.jpg" alt="Official DESCO Compass logo" className="mx-auto mb-4 h-28 w-28 rounded-full object-cover shadow-[0_8px_24px_rgb(184_149_61/0.45)]" />
          </Link>
          <div className="font-display font-extrabold text-3xl text-white tracking-tight">DESCO <span className="text-gold">Compass</span></div>
          <p className="text-white/65 text-sm mt-2">{t("login.tagline")}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_12px_32px_rgb(0_0_0/0.4)]">
          {demoEnabled ? (
            <>
              <h1 className="font-display font-bold text-xl mb-1">{t("login.demoTitle")}</h1>
              <p className="text-xs text-wgray mb-5">{t("login.demoSubtitle")}</p>
              <div className="grid gap-3">{PERSONAS.filter((p) => p.id !== "admin" || adminEnabled).map((p) => (
                <button key={p.id} onClick={() => enterDemo(p.id)} disabled={!!busy} className="flex min-h-11 items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl border-2 border-charcoal/10 hover:border-gold hover:bg-gold-soft font-display font-bold text-sm transition-colors disabled:opacity-60">
                  <span aria-hidden="true" className="w-8 h-8 rounded-full bg-charcoal text-gold flex items-center justify-center">{p.icon}</span>{busy === p.id ? t("login.busy") : t(p.labelKey)}
                </button>
              ))}</div>
              <p className="text-xs text-wgray mt-5 leading-relaxed">{t("login.demoNote")}</p>
            </>
          ) : (mode === "login" ? accessEnabled : signupEnabled) ? sent ? (
            <div role="status" aria-live="polite" className="text-center py-3">
              <div aria-hidden="true" className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-gold-soft text-ink">✓</div>
              <h1 className="font-display font-bold text-xl">{account.checkEmailTitle}</h1>
              <p className="mt-3 text-sm leading-6 text-wgray">{account.checkEmailBody}</p>
            </div>
          ) : (
            <>
              <h1 className="font-display font-bold text-xl mb-1">{mode === "signup" ? account.signupTitle : account.loginTitle}</h1>
              <p className="text-sm leading-6 text-wgray mb-5">{mode === "signup" ? account.signupIntro : account.loginIntro}</p>
              <form onSubmit={requestLink} className="space-y-4">
                {mode === "signup" && <div><label htmlFor="fullName" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-wgray">{account.fullName}</label><input id="fullName" name="fullName" autoComplete="name" required minLength={2} maxLength={150} value={fullName} onChange={(e) => setFullName(e.target.value)} className="min-h-11 w-full rounded-xl bg-mist px-4 py-3 text-sm" /></div>}
                <div><label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-wgray">{account.email}</label><input id="email" name="email" autoComplete="email" type="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-11 w-full rounded-xl bg-mist px-4 py-3 text-sm" /></div>
                {mode === "signup" && <><div className="rounded-xl border border-gold/25 bg-gold-soft p-3 text-xs leading-5 text-charcoal">{account.basicAccountNotice}</div><label className="flex items-start gap-3 text-xs leading-5 text-slate"><input type="checkbox" required checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-gold" /><span>{account.termsAcceptance} <Link href="/legal" className="font-bold text-ink underline underline-offset-2">{account.termsLink}</Link>.</span></label></>}
                {error && <div role="alert" className="rounded-lg bg-brandred/10 px-3 py-2 text-xs text-brandred">{error}</div>}
                <button disabled={busy === "email" || (mode === "signup" && !acceptedTerms)} className="button-primary w-full disabled:opacity-60">{busy === "email" ? account.sending : account.sendLink}</button>
              </form>
              {(mode === "signup" || signupEnabled) && <Link href={switchHref} className="mt-5 block min-h-11 py-3 text-center text-sm font-bold text-ink underline underline-offset-4">{mode === "signup" ? account.switchToLogin : account.switchToSignup}</Link>}
            </>
          ) : (
            <div className="text-center"><h1 className="font-display font-bold text-xl">{account.unavailableTitle}</h1><p className="mt-3 text-sm leading-6 text-wgray">{account.unavailableBody}</p><Link href="/contact?topic=investor-access" className="button-primary mt-5 w-full">{account.contact}</Link></div>
          )}
          <Link href="/opportunities" className="button-secondary mt-5 w-full">{copy.backToOpportunities}</Link>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-white/70"><a href="/legal">{copy.privacy}</a><a href="/legal">{copy.terms}</a><a href="/legal">{copy.security}</a><a href="/contact">{copy.contact}</a></div>
        <p className="mt-3 text-center text-xs text-white/60">desco.global | © 2026 DESCO Global</p>
      </div>
    </div>
  );
}
