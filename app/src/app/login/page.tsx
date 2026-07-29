"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
import { sanitizeNextPath } from "@/lib/nextParam";
import { sharedCopy } from "@/lib/translations/shared";

const PERSONAS = [
  { id: "investor", labelKey: "login.demoInvestor", icon: "◈" },
  { id: "owner", labelKey: "login.demoOwner", icon: "▲" },
  { id: "advisor", labelKey: "login.demoAdvisor", icon: "✦" },
  { id: "admin", labelKey: "login.demoAdmin", icon: "⚙" },
];

// useSearchParams() requires a Suspense boundary or `next build` fails
// static generation for this page.
export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { locale, t } = useI18n();
  const copy = sharedCopy(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enter = async (persona: string) => {
    setBusy(persona);
    setError(null);
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Sign-in failed");
        return;
      }
      router.push(sanitizeNextPath(searchParams.get("next")));
      router.refresh();
    } catch {
      setError("Network error — retry.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" aria-label="Return to DESCO Compass home" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/desco-coin.png"
              alt=""
              className="mx-auto mb-4 h-20 w-20 rounded-full shadow-[0_8px_24px_rgb(184_149_61/0.45)]"
            />
          </Link>
          <div className="font-display font-extrabold text-3xl text-white tracking-tight">
            DESCO <span className="text-gold">Compass</span>
          </div>
          <p className="text-white/50 text-sm mt-2">{t("login.tagline")}</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-[0_12px_32px_rgb(0_0_0/0.4)]">
          <h1 className="font-display font-bold text-xl mb-1">
            {t("login.demoTitle")}
          </h1>
          <p className="text-xs text-wgray mb-5">{t("login.demoSubtitle")}</p>
          <div className="grid gap-3">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => enter(p.id)}
                disabled={!!busy}
                className="flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl border-2 border-charcoal/10 hover:border-gold hover:bg-gold-soft font-display font-bold text-sm transition-colors disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-gold"
              >
                <span className="w-8 h-8 rounded-full bg-charcoal text-gold flex items-center justify-center">
                  {p.icon}
                </span>
                {busy === p.id ? t("login.busy") : t(p.labelKey)}
              </button>
            ))}
          </div>
          {error && (
            <div role="alert" className="text-xs text-brandred bg-brandred/10 rounded-lg px-3 py-2 mt-4">
              {error}
            </div>
          )}
          <p className="text-[11px] text-wgray mt-5 leading-relaxed">
            {t("login.demoNote")}
          </p>
          <Link href="/opportunities" className="button-secondary mt-5 w-full">
            {copy.backToOpportunities}
          </Link>
        </div>

        <div className="mt-6 flex justify-center gap-4 text-xs text-white/65">
          <a href="/legal" className="hover:text-white/70">{copy.privacy}</a>
          <a href="/legal" className="hover:text-white/70">{copy.terms}</a>
          <a href="/legal" className="hover:text-white/70">{copy.security}</a>
          <a href="/contact" className="hover:text-white/70">{copy.contact}</a>
        </div>
        <p className="mt-3 text-center text-xs text-white/60">
          desco.global | © 2026 DESCO Global
        </p>
      </div>
    </div>
  );
}
