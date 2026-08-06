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
    <footer className="mt-auto border-t border-charcoal/10 bg-white">
      <div className="public-container grid gap-8 py-9 text-xs text-wgray lg:grid-cols-[1fr_auto_auto] lg:items-start lg:gap-12">
        <div className="flex max-w-sm items-start gap-3">
          <span className="mt-0.5"><BrandMark size={28} showName={false} /></span>
          <span className="leading-5">© {new Date().getFullYear()} DESCO Global.</span>
        </div>
        <nav aria-label={copy.exploreNavigation} className="grid grid-cols-2 gap-x-8 font-semibold sm:grid-cols-4 lg:grid-cols-2">
          <Link href="/opportunities" className="inline-flex min-h-11 items-center hover:text-charcoal">{t("nav.opportunities")}</Link>
          <Link href="/investors" className="inline-flex min-h-11 items-center hover:text-charcoal">{t("nav.forInvestors")}</Link>
          <Link href="/sponsors" className="inline-flex min-h-11 items-center hover:text-charcoal">{t("nav.forOwners")}</Link>
          <Link href="/diligence" className="inline-flex min-h-11 items-center hover:text-charcoal">{t("nav.howItWorks")}</Link>
          <Link href="/pricing" className="inline-flex min-h-11 items-center hover:text-charcoal">{t("nav.billing")}</Link>
          <Link href="/partners" className="inline-flex min-h-11 items-center hover:text-charcoal">{t("nav.partners")}</Link>
          <Link href="/resources" className="inline-flex min-h-11 items-center hover:text-charcoal">{resources.nav}</Link>
        </nav>
        <nav aria-label={copy.companyNavigation} className="grid grid-cols-2 gap-x-8 font-semibold lg:grid-cols-1">
          <Link href="/about" className="inline-flex min-h-11 items-center hover:text-charcoal">{t("nav.about")}</Link>
          <Link href="/contact" className="inline-flex min-h-11 items-center hover:text-charcoal">{t("nav.contact")}</Link>
          <Link href="/legal" className="inline-flex min-h-11 items-center hover:text-charcoal">{t("nav.legal")}</Link>
        </nav>
      </div>
    </footer>
  );
}
