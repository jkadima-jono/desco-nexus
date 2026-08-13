"use client";

import Link from "next/link";
import { useI18n } from "./I18nProvider";
import { sharedCopy } from "@/lib/translations/shared";
import BrandMark from "./BrandMark";
import { resourceCopy } from "@/lib/translations/resources";

export default function Footer() {
  const { locale, t } = useI18n();
  const copy = sharedCopy(locale);
  const resources = resourceCopy(locale);
  return (
    <footer className="mt-auto bg-desco-charcoal text-white">
      <div className="public-container grid gap-10 py-12 lg:grid-cols-[1fr_auto_auto] lg:items-start lg:gap-16">
        <div className="flex max-w-sm items-start gap-4">
          <span><BrandMark size={42} showName={false} /></span>
          <p className="font-sans text-[17px] leading-[1.7] text-white">DESCO Compass<br />Structured project preparation and screening.</p>
        </div>
        <nav aria-label={copy.exploreNavigation}>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-desco-gold">{copy.exploreNavigation}</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-8 lg:grid-cols-2">
          <Link href="/opportunities" className="inline-flex min-h-11 items-center font-sans text-[17px] hover:text-desco-gold">{t("nav.opportunities")}</Link>
          <Link href="/investors" className="inline-flex min-h-11 items-center font-sans text-[17px] hover:text-desco-gold">{t("nav.forInvestors")}</Link>
          <Link href="/sponsors" className="inline-flex min-h-11 items-center font-sans text-[17px] hover:text-desco-gold">{t("nav.forOwners")}</Link>
          <Link href="/diligence" className="inline-flex min-h-11 items-center font-sans text-[17px] hover:text-desco-gold">{t("nav.howItWorks")}</Link>
          <Link href="/pricing" className="inline-flex min-h-11 items-center font-sans text-[17px] hover:text-desco-gold">{t("nav.billing")}</Link>
          <Link href="/partners" className="inline-flex min-h-11 items-center font-sans text-[17px] hover:text-desco-gold">{t("nav.partners")}</Link>
          <Link href="/resources" className="inline-flex min-h-11 items-center font-sans text-[17px] hover:text-desco-gold">{resources.nav}</Link>
          </div>
        </nav>
        <nav aria-label={copy.companyNavigation}>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-desco-gold">{copy.companyNavigation}</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-8 lg:grid-cols-1">
          <Link href="/about" className="inline-flex min-h-11 items-center font-sans text-[17px] hover:text-desco-gold">{t("nav.about")}</Link>
          <Link href="/contact" className="inline-flex min-h-11 items-center font-sans text-[17px] hover:text-desco-gold">{t("nav.contact")}</Link>
          <Link href="/legal" className="inline-flex min-h-11 items-center font-sans text-[17px] hover:text-desco-gold">{t("nav.legal")}</Link>
          </div>
        </nav>
      </div>
      <div className="public-container border-t border-[#4a4a4a] py-5 font-sans text-sm text-desco-surface">desco.global | © 2026 Desco Global</div>
    </footer>
  );
}
