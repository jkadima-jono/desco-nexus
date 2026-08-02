import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { accountCopy } from "@/lib/translations/account";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Account ready — DESCO Compass", robots: { index: false, follow: false } };

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/onboarding");
  const copy = accountCopy(await getLocale());
  return <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8"><div className="rounded-3xl bg-white p-6 shadow-sm sm:p-10"><p className="eyebrow text-gold">DESCO Compass</p><h1 className="mt-3 font-display text-3xl font-bold text-ink">{copy.onboardingTitle}</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-wgray">{copy.onboardingBody}</p><div className="restricted-panel mt-6"><span className="restricted-mark" aria-hidden="true">i</span><p>{copy.onboardingBoundary}</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><Link href="/opportunities" className="button-primary">{copy.reviewOpportunities}</Link><Link href="/mandates" className="button-secondary">{copy.createMandate}</Link></div></div></div>;
}
