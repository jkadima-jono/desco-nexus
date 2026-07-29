"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useI18n } from "./I18nProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { sharedCopy } from "@/lib/translations/shared";
import NotificationBell from "./NotificationBell";
import { useModalFocus } from "./useModalFocus";

type NavItem = { href: string; key: string; icon: string };
type NavGroup = { labelKey: string; items: NavItem[] };

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

const OPPORTUNITIES: NavItem = { href: "/opportunities", key: "nav.opportunities", icon: "◈" };
const HOW_IT_WORKS: NavItem = { href: "/diligence", key: "nav.howItWorks", icon: "▤" };
const FOR_INVESTORS: NavItem = { href: "/investors", key: "nav.forInvestors", icon: "☰" };
const FOR_OWNERS: NavItem = { href: "/sponsors", key: "nav.forOwners", icon: "▲" };
const SUBMIT_PROJECT: NavItem = { href: "/submit-project", key: "nav.submitProject", icon: "▲" };
const ADMIN_HOME: NavItem = { href: "/admin", key: "nav.adminHome", icon: "▦" };
const REVIEW_SUBMISSIONS: NavItem = { href: "/admin/submissions", key: "nav.reviewSubmissions", icon: "▲" };
const VERIFICATION: NavItem = { href: "/admin/verification", key: "nav.verification", icon: "✓" };
const AI_USAGE: NavItem = { href: "/admin/ai-usage", key: "nav.aiUsage", icon: "✦" };
const BILLING: NavItem = { href: "/admin/users", key: "nav.billing", icon: "$" };
const CONTRACTS: NavItem = { href: "/admin/contracts", key: "nav.contracts", icon: "§" };
const ANALYTICS: NavItem = { href: "/admin/analytics", key: "nav.analytics", icon: "▥" };
const TRUST: NavItem = { href: "/trust", key: "nav.trust", icon: "✓" };
const ABOUT: NavItem = { href: "/about", key: "nav.about", icon: "◆" };
const INQUIRIES: NavItem = { href: "/admin/inquiries", key: "nav.inquiries", icon: "✉" };
const CRM: NavItem = { href: "/admin/crm", key: "nav.crm", icon: "◎" };

// Role-appropriate subsets of real, working routes only — no links to
// pages that don't exist yet (data-rooms/analytics land in later phases
// and gain nav entries then, not before).
const NAV_BY_ROLE: Record<string, NavItem[]> = {
  signedOut: [OPPORTUNITIES, FOR_INVESTORS, FOR_OWNERS, HOW_IT_WORKS, PILLARS, TRUST, ABOUT, CONTACT],
  investor: [DISCOVER, MATCH, SAVED, MANDATES, PIPELINE, PORTFOLIO, SEARCH, MESSAGES, PILLARS],
  owner: [PROJECTS, SUBMIT_PROJECT, INVESTOR_MATCHES, MESSAGES, PILLARS],
  advisor: [DISCOVER, MANDATES, TRANSACTIONS, MESSAGES, PILLARS],
  admin: [ADMIN_HOME, CRM, DISCOVER, MATCH, SAVED, MANDATES, PIPELINE, PORTFOLIO, INVESTOR_MATCHES, REVIEW_SUBMISSIONS, VERIFICATION, AI_USAGE, CONTRACTS, ANALYTICS, BILLING, SEARCH, MESSAGES, PILLARS],
};

const ADMIN_GROUPS: NavGroup[] = [
  { labelKey: "navGroup.overview", items: [ADMIN_HOME, CRM] },
  { labelKey: "navGroup.investment", items: [DISCOVER, MATCH, SAVED, MANDATES, PIPELINE, PORTFOLIO] },
  { labelKey: "navGroup.control", items: [INVESTOR_MATCHES, REVIEW_SUBMISSIONS, VERIFICATION, INQUIRIES] },
  { labelKey: "navGroup.operations", items: [AI_USAGE, CONTRACTS, ANALYTICS, BILLING] },
  { labelKey: "navGroup.tools", items: [SEARCH, MESSAGES, PILLARS] },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/" || href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarUser = { fullName: string; title: string | null; role?: string } | null;

export default function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, t } = useI18n();
  const copy = sharedCopy(locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLElement>(null);
  const closeMobileNavigation = useCallback(() => setMobileOpen(false), []);
  useModalFocus({
    open: mobileOpen,
    container: mobileNavigationRef,
    initialFocus: closeButtonRef,
    returnFocus: menuButtonRef,
    onClose: closeMobileNavigation,
  });
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };
  const nav = NAV_BY_ROLE[user?.role ?? "signedOut"] ?? NAV_BY_ROLE.investor;
  const navGroups: NavGroup[] = user?.role === "admin"
    ? ADMIN_GROUPS
    : [{ labelKey: "navGroup.workspace", items: nav }];
  const navigation = (
    <>
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/desco-compass-logo.jpg" alt="Official DESCO Compass logo" className="h-11 w-11 rounded-full object-cover shadow-[0_2px_8px_rgb(184_149_61/0.5)]" />
          <div>
            <div className="font-display font-extrabold text-lg tracking-tight leading-tight">DESCO <span className="text-gold">Compass</span></div>
            <div className="text-[10px] text-white/50 font-body">{t("brand.tagline")}</div>
          </div>
        </div>
      </div>
      <nav aria-label="Workspace navigation" className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {navGroups.map((group, groupIndex) => (
          <div key={group.labelKey} className={groupIndex > 0 ? "mt-5 border-t border-white/8 pt-4" : ""}>
            <p className="mb-1 px-3 text-xs font-bold uppercase tracking-[0.14em] text-white/65">
              {t(group.labelKey)}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActiveRoute(pathname, item.href);
                return (
                  <Link key={item.key} href={item.href} onClick={() => setMobileOpen(false)} aria-current={active ? "page" : undefined} className={"flex items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm font-semibold transition-colors " + (active ? "border-gold bg-gold/14 text-white" : "border-transparent text-white/68 hover:bg-white/8 hover:text-white")}>
                    <span aria-hidden="true" className={active ? "w-5 text-center text-gold" : "w-5 text-center"}>{item.icon}</span>{t(item.key)}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-4 pb-3"><LanguageSwitcher /></div>
      <div className="px-4 py-4 border-t border-white/10">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold text-ink font-display font-bold flex items-center justify-center">{user.fullName.charAt(0)}</div>
            <div className="min-w-0 flex-1"><div className="text-sm font-semibold truncate">{user.fullName}</div><div className="text-[11px] text-gold truncate">✓ {user.title ?? t("nav.member")}</div></div>
            <NotificationBell />
            <button onClick={logout} className="text-[11px] text-white/60 hover:text-white" aria-label={copy.signOut}>⎋</button>
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
      <aside className="hidden lg:flex w-60 shrink-0 bg-ink text-white flex-col min-h-screen sticky top-0 h-screen overflow-hidden">
        {navigation}
      </aside>
      <header className="lg:hidden fixed inset-x-0 top-0 z-40 h-16 bg-ink text-white flex items-center justify-between px-4 shadow-lg">
        <Link href="/" className="font-display font-extrabold">DESCO <span className="text-gold">Compass</span></Link>
        <button ref={menuButtonRef} type="button" onClick={() => setMobileOpen(true)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="min-w-11 min-h-11 rounded-xl border border-white/20 text-xl" aria-label={t("nav.open")}>☰</button>
      </header>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" role="presentation" onClick={() => setMobileOpen(false)}>
          <aside ref={mobileNavigationRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label={copy.workspaceNavigation} tabIndex={-1} className="relative h-full w-full overflow-hidden bg-ink text-white flex flex-col shadow-2xl sm:w-80" onClick={(e) => e.stopPropagation()}>
            <button ref={closeButtonRef} type="button" onClick={() => setMobileOpen(false)} className="absolute z-10 top-3 right-3 min-w-11 min-h-11 rounded-xl text-2xl text-white hover:bg-white/10" aria-label={t("nav.close")}>×</button>
            {navigation}
          </aside>
        </div>
      )}
    </>
  );
}
