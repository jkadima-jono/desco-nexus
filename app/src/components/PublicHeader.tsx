"use client";

import Button from "@/components/ui/Button";

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
  ["/resources", "nav.resources"],
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
    <nav aria-label={t("nav.public")} className={desktop ? "flex items-center gap-8" : "flex flex-col items-start gap-1"}>
      {LINKS.map(([href, labelKey], index) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`min-h-11 whitespace-nowrap border-b-[3px] px-0 py-3 font-sans text-2xl font-semibold uppercase tracking-normal xl:min-h-0 xl:py-2 xl:text-[19px] ${
              active ? "border-desco-gold text-desco-gold" : "border-transparent text-white hover:text-desco-gold"
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
      <header className="sticky top-0 z-40 border-b border-desco-charcoal bg-black text-white">
        <div className="flex h-16 w-full items-center justify-between gap-3 px-6 xl:h-[88px]">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`DESCO Compass — ${t("common.home")}`}>
            <BrandMark compactDesktop />
          </Link>
          <div className="hidden min-w-0 items-center gap-8 xl:flex">
            {navigation(true)}
            <div className="w-32 shrink-0"><LanguageSwitcher /></div>
            {!user && signupEnabled && <Link href="/login" className="shrink-0 px-2 py-2 text-[11px] font-bold text-white underline-offset-4 hover:underline xl:text-xs">{account.signIn}</Link>}
            <Button href={workspaceHref} className="button-primary shrink-0 px-2 text-[11px] xl:px-3 xl:text-xs 2xl:px-4 2xl:text-[0.82rem]">{workspaceLabel}</Button>
          </div>
          <Button
            ref={menuButton}
            variant="ghost-light"
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="public-mobile-navigation"
            className="grid min-h-11 min-w-11 shrink-0 place-items-center border border-white/20 text-xl xl:hidden"
            aria-label={t("nav.open")}
          >
            ☰
          </Button>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 bg-black xl:hidden" onClick={() => setOpen(false)}>
          <aside
            ref={mobileNavigation}
            id="public-mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.public")}
            tabIndex={-1}
            className="flex h-full w-full flex-col overflow-y-auto bg-black p-6 text-left text-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display font-extrabold">DESCO <span className="text-gold">Compass</span></span>
              <Button
                ref={closeButton}
                variant="ghost-light"
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-11 min-w-11  text-2xl hover:bg-white/10"
                aria-label={t("nav.close")}
              >
                ×
              </Button>
            </div>
            {navigation()}
            <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
              <LanguageSwitcher />
              {!user && signupEnabled && <Button href="/login" onClick={() => setOpen(false)} variant="ghost-light" className="w-full">{account.signIn}</Button>}
              <Button href={workspaceHref} onClick={() => setOpen(false)} variant="solid-brand" className="w-full">{workspaceLabel}</Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
