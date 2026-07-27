"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

const LINKS = [
  ["/opportunities", "Opportunities"],
  ["/investors", "Investors"],
  ["/sponsors", "Project sponsors"],
  ["/diligence", "Diligence"],
  ["/trust", "Trust"],
  ["/about", "About"],
] as const;

export default function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", closeOnEscape);
      menuButton.current?.focus();
    };
  }, [open]);

  const nav = (
    <nav aria-label="Public navigation" className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-1">
      {LINKS.map(([href, label]) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`min-h-11 rounded-md px-3 py-3 text-sm font-semibold lg:min-h-0 lg:py-2 ${
              active ? "bg-gold-soft text-ink" : "text-white/75 hover:bg-white/8 hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink text-white">
        <div className="public-container flex h-16 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label="DESCO Nexus home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/desco-coin.png" alt="" className="h-9 w-9 rounded-full" />
            <span className="font-display text-base font-extrabold">
              DESCO <span className="text-gold">Nexus</span>
            </span>
          </Link>
          <div className="hidden items-center gap-3 lg:flex">
            {nav}
            <div className="w-32"><LanguageSwitcher /></div>
            <Link href="/login" className="button-on-dark">Enter workspace</Link>
          </div>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="public-mobile-navigation"
            className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-white/20 text-xl lg:hidden"
            aria-label="Open navigation"
          >
            ☰
          </button>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/55 lg:hidden" onClick={() => setOpen(false)}>
          <aside
            id="public-mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Public navigation"
            className="ml-auto flex h-full w-[min(21rem,90vw)] flex-col overflow-y-auto bg-ink p-5 text-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display font-extrabold">DESCO <span className="text-gold">Nexus</span></span>
              <button
                ref={closeButton}
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-11 min-w-11 rounded-lg text-2xl hover:bg-white/10"
                aria-label="Close navigation"
              >
                ×
              </button>
            </div>
            {nav}
            <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
              <LanguageSwitcher />
              <Link href="/login" onClick={() => setOpen(false)} className="button-primary w-full">Enter workspace</Link>
              <Link href="/contact?topic=investor-access" onClick={() => setOpen(false)} className="button-on-dark w-full">Apply for access</Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
