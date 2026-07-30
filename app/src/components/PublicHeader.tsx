"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "./I18nProvider";
import { useModalFocus } from "./useModalFocus";
import BrandMark from "./BrandMark";

const LINKS = [
  ["/opportunities", "nav.opportunities"],
  ["/investors", "nav.forInvestors"],
  ["/sponsors", "nav.forOwners"],
  ["/diligence", "nav.howItWorks"],
  ["/trust", "nav.trust"],
  ["/about", "nav.about"],
] as const;

export default function PublicHeader({ user }: { user?: { role?: string } | null }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const mobileNavigation = useRef<HTMLElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);
  const workspaceHref = user
    ? user.role === "owner" ? "/submit-project" : user.role === "admin" ? "/admin/verification" : "/match"
    : "/contact?topic=investor-access";
  const workspaceLabel = user ? t("nav.openWorkspace") : t("nav.enterWorkspace");
  useModalFocus({ open, container: mobileNavigation, initialFocus: closeButton, returnFocus: menuButton, onClose: closeMenu });

  const nav = (
    <nav aria-label={t("nav.public")} className="flex flex-col gap-1 2xl:flex-row 2xl:items-center 2xl:gap-1">
      {LINKS.map(([href, labelKey]) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`min-h-11 whitespace-nowrap rounded-md px-2.5 py-3 text-sm font-semibold 2xl:min-h-0 2xl:py-2 ${
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
        <div className="mx-auto flex h-16 w-[calc(100%-2rem)] max-w-[106rem] items-center justify-between gap-6 md:w-[calc(100%-3rem)]">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="DESCO Compass home">
            <BrandMark />
          </Link>
          <div className="hidden items-center gap-2 2xl:flex">
            {nav}
            <div className="w-32"><LanguageSwitcher /></div>
            <Link href={workspaceHref} className="button-on-dark">{workspaceLabel}</Link>
          </div>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="public-mobile-navigation"
            className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-white/20 text-xl 2xl:hidden"
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
            {nav}
            <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
              <LanguageSwitcher />
              <Link href={workspaceHref} onClick={() => setOpen(false)} className="button-on-dark w-full">{workspaceLabel}</Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
