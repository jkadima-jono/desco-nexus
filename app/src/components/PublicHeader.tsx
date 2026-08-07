"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "./I18nProvider";
import { useModalFocus } from "./useModalFocus";
import BrandMark from "./BrandMark";
import { accountCopy } from "@/lib/translations/account";

const LINKS = [
  ["/opportunities", "nav.opportunities"],
  ["/investors", "nav.forInvestors"],
  ["/sponsors", "nav.forOwners"],
  ["/diligence", "nav.howItWorks"],
  ["/trust", "nav.trust"],
  ["/pricing", "nav.billing"],
] as const;

export default function PublicHeader({ user, signupEnabled }: { user?: { role?: string } | null; signupEnabled: boolean }) {
  const { locale, t } = useI18n();
  const account = accountCopy(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const mobileNavigation = useRef<HTMLElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);
  const workspaceHref = user
    ? user.role === "owner" ? "/submit-project" : user.role === "admin" ? "/admin/verification" : "/match"
    : signupEnabled ? "/signup" : "/contact?topic=investor-access";
  const workspaceLabel = user ? account.openWorkspace : signupEnabled ? account.createAccount : t("nav.enterWorkspace");
  useModalFocus({ open, container: mobileNavigation, initialFocus: closeButton, returnFocus: menuButton, onClose: closeMenu });

  const navigation = (desktop = false) => (
    <nav aria-label={t("nav.public")} className={desktop ? "flex items-center gap-1" : "flex flex-col gap-1"}>
      {LINKS.map(([href, labelKey], index) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`${desktop && index >= 3 ? "hidden 2xl:inline-flex" : ""} min-h-11 whitespace-nowrap rounded-md px-2.5 py-3 text-sm font-semibold lg:min-h-0 lg:px-1.5 lg:py-2 lg:text-[11px] xl:px-2 xl:text-xs 2xl:px-2.5 2xl:text-sm ${
              active ? "bg-gold-soft text-ink" : "text-white/75 hover:bg-white/8 hover:text-white"
            }`}
          >
            {t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink text-white">
        <div className="mx-auto flex h-16 w-[calc(100%-2rem)] max-w-[106rem] items-center justify-between gap-3 md:w-[calc(100%-3rem)] lg:w-[calc(100%-2rem)] xl:gap-4 2xl:w-[calc(100%-3rem)] 2xl:gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`DESCO Compass — ${t("common.home")}`}>
            <BrandMark compactDesktop />
          </Link>
          <div className="hidden min-w-0 items-center gap-2 lg:flex">
            {navigation(true)}
            <div className="hidden w-24 shrink-0 xl:block xl:w-28 2xl:w-32"><LanguageSwitcher /></div>
            {!user && signupEnabled && <Link href="/login" className="shrink-0 px-2 py-2 text-[11px] font-bold text-white underline-offset-4 hover:underline xl:text-xs">{account.signIn}</Link>}
            <Link href={workspaceHref} className="button-primary shrink-0 px-2 text-[11px] xl:px-3 xl:text-xs 2xl:px-4 2xl:text-[0.82rem]">{workspaceLabel}</Link>
          </div>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="public-mobile-navigation"
            className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-lg border border-white/20 text-xl 2xl:hidden"
            aria-label={t("nav.open")}
          >
            ☰
          </button>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/55 2xl:hidden" onClick={() => setOpen(false)}>
          <aside
            ref={mobileNavigation}
            id="public-mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.public")}
            tabIndex={-1}
            className="ml-auto flex h-full w-full flex-col overflow-y-auto bg-ink p-5 text-white sm:w-[22rem]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display font-extrabold">DESCO <span className="text-gold">Compass</span></span>
              <button
                ref={closeButton}
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-11 min-w-11 rounded-lg text-2xl hover:bg-white/10"
                aria-label={t("nav.close")}
              >
                ×
              </button>
            </div>
            {navigation()}
            <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
              <LanguageSwitcher />
              {!user && signupEnabled && <Link href="/login" onClick={() => setOpen(false)} className="button-on-dark w-full">{account.signIn}</Link>}
              <Link href={workspaceHref} onClick={() => setOpen(false)} className="button-primary w-full">{workspaceLabel}</Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
