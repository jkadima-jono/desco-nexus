"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "./I18nProvider";
import LanguageSwitcher from "./LanguageSwitcher";

type NavItem = { href: string; key: string; icon: string };

const DISCOVER: NavItem = { href: "/", key: "nav.discover", icon: "◈" };
const MATCH: NavItem = { href: "/match", key: "nav.match", icon: "⇄" };
const PIPELINE: NavItem = { href: "/deals", key: "nav.pipeline", icon: "▤" };
const PROJECTS: NavItem = { href: "/deals", key: "nav.projects", icon: "▤" };
const TRANSACTIONS: NavItem = { href: "/deals", key: "nav.transactions", icon: "▤" };
const PORTFOLIO: NavItem = { href: "/portfolio", key: "nav.portfolio", icon: "◇" };
const SEARCH: NavItem = { href: "/search", key: "nav.search", icon: "✦" };
const MESSAGES: NavItem = { href: "/messages", key: "nav.messages", icon: "✉" };
const PILLARS: NavItem = { href: "/pillars", key: "nav.pillars", icon: "◆" };
const INVESTOR_MATCHES: NavItem = { href: "/sponsor/investors", key: "nav.investorMatches", icon: "⇄" };
const MANDATES: NavItem = { href: "/mandates", key: "nav.mandates", icon: "☰" };
const SAVED: NavItem = { href: "/saved", key: "nav.saved", icon: "★" };
const CONTACT: NavItem = { href: "/contact", key: "nav.contact", icon: "✉" };

// Public nav taxonomy. Several of these route to the closest real
// destination rather than a dedicated page (e.g. "For investors" →
// /mandates, "About DESCO" → /pillars) — no dedicated marketing pages
// exist yet for every concept; anchors (#how-it-works, #trust) point
// into the homepage sections that carry that content.
const OPPORTUNITIES: NavItem = { href: "/", key: "nav.opportunities", icon: "◈" };
const HOW_IT_WORKS: NavItem = { href: "/#how-it-works", key: "nav.howItWorks", icon: "▤" };
const FOR_INVESTORS: NavItem = { href: "/mandates", key: "nav.forInvestors", icon: "☰" };
const FOR_OWNERS: NavItem = { href: "/submit-project", key: "nav.forOwners", icon: "▲" };
const SUBMIT_PROJECT: NavItem = { href: "/submit-project", key: "nav.submitProject", icon: "▲" };
const REVIEW_SUBMISSIONS: NavItem = { href: "/admin/submissions", key: "nav.reviewSubmissions", icon: "▲" };
const TRUST: NavItem = { href: "/#trust", key: "nav.trust", icon: "✓" };
const ABOUT: NavItem = { href: "/pillars", key: "nav.about", icon: "◆" };

// Role-appropriate subsets of real, working routes only — no links to
// pages that don't exist yet (data-rooms/analytics land in later phases
// and gain nav entries then, not before).
const NAV_BY_ROLE: Record<string, NavItem[]> = {
  signedOut: [OPPORTUNITIES, HOW_IT_WORKS, FOR_INVESTORS, FOR_OWNERS, PILLARS, TRUST, ABOUT, CONTACT],
  investor: [DISCOVER, MATCH, SAVED, MANDATES, PIPELINE, PORTFOLIO, SEARCH, MESSAGES, PILLARS],
  owner: [PROJECTS, SUBMIT_PROJECT, INVESTOR_MATCHES, MESSAGES, PILLARS],
  advisor: [DISCOVER, MANDATES, TRANSACTIONS, MESSAGES, PILLARS],
  admin: [DISCOVER, MATCH, SAVED, MANDATES, PIPELINE, PORTFOLIO, INVESTOR_MATCHES, REVIEW_SUBMISSIONS, SEARCH, MESSAGES, PILLARS],
};

type SidebarUser = { fullName: string; title: string | null; role?: string } | null;

export default function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [mobileOpen]);
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };
  const nav = NAV_BY_ROLE[user?.role ?? "signedOut"] ?? NAV_BY_ROLE.investor;
  const navigation = (
    <>
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/desco-coin.png" alt="Desco Global" className="w-10 h-10 rounded-full shadow-[0_2px_8px_rgb(184_149_61/0.5)]" />
          <div>
            <div className="font-display font-extrabold text-lg tracking-tight leading-tight">DESCO <span className="text-gold">Nexus</span></div>
            <div className="text-[10px] text-white/50 font-body">{t("brand.tagline")}</div>
          </div>
        </div>
      </div>
      <nav aria-label="Primary navigation" className="px-3 space-y-1 flex-1">
        {nav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.key} href={item.href} onClick={() => setMobileOpen(false)} aria-current={active ? "page" : undefined} className={"flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors " + (active ? "bg-gold text-ink" : "text-white/70 hover:bg-white/10 hover:text-white")}>
              <span aria-hidden="true" className="w-5 text-center">{item.icon}</span>{t(item.key)}
            </Link>
          );
        })}
      </nav>
      {user?.role === "admin" && (
        <div className="px-3 pb-1">
          <Link href="/admin/inquiries" className={"flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors " + (pathname.startsWith("/admin") ? "bg-gold text-ink" : "text-white/70 hover:bg-white/10 hover:text-white")}>
            <span aria-hidden="true" className="w-5 text-center">✉</span>{t("nav.inquiries")}
          </Link>
        </div>
      )}
      <div className="px-4 pb-3"><LanguageSwitcher /></div>
      <div className="px-4 py-4 border-t border-white/10">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold text-ink font-display font-bold flex items-center justify-center">{user.fullName.charAt(0)}</div>
            <div className="min-w-0 flex-1"><div className="text-sm font-semibold truncate">{user.fullName}</div><div className="text-[11px] text-gold truncate">✓ {user.title ?? t("nav.member")}</div></div>
            <button onClick={logout} className="text-[11px] text-white/60 hover:text-white" aria-label="Sign out">⎋</button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link href="/login" className="block text-center bg-gold text-ink font-display font-bold text-sm py-2.5 rounded-xl hover:brightness-110">{t("nav.signIn")}</Link>
            <Link href="/contact" className="block text-center border border-white/20 text-white font-display font-semibold text-xs py-2 rounded-xl hover:bg-white/10">{t("nav.apply")}</Link>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex w-60 shrink-0 bg-ink text-white flex-col min-h-screen sticky top-0 h-screen">
        {navigation}
      </aside>
      <header className="lg:hidden fixed inset-x-0 top-0 z-40 h-16 bg-ink text-white flex items-center justify-between px-4 shadow-lg">
        <Link href="/" className="font-display font-extrabold">DESCO <span className="text-gold">Nexus</span></Link>
        <button ref={menuButtonRef} type="button" onClick={() => setMobileOpen(true)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="min-w-11 min-h-11 rounded-xl border border-white/20 text-xl" aria-label="Open navigation">☰</button>
      </header>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" role="presentation" onClick={() => setMobileOpen(false)}>
          <aside id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Primary navigation" className="relative w-[min(20rem,88vw)] h-full bg-ink text-white flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button ref={closeButtonRef} type="button" onClick={() => setMobileOpen(false)} className="absolute z-10 top-3 right-3 min-w-11 min-h-11 rounded-xl text-2xl text-white hover:bg-white/10" aria-label="Close navigation">×</button>
            {navigation}
          </aside>
        </div>
      )}
    </>
  );
}
