"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "./I18nProvider";
import LanguageSwitcher from "./LanguageSwitcher";

const nav = [
  { href: "/", key: "nav.discover", icon: "◈" },
  { href: "/match", key: "nav.match", icon: "⇄" },
  { href: "/deals", key: "nav.deals", icon: "▤" },
  { href: "/search", key: "nav.search", icon: "✦" },
  { href: "/messages", key: "nav.messages", icon: "✉" },
];

type SidebarUser = { fullName: string; title: string | null } | null;

export default function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };
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
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} aria-current={active ? "page" : undefined} className={"flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors " + (active ? "bg-gold text-ink" : "text-white/70 hover:bg-white/10 hover:text-white")}>
              <span aria-hidden="true" className="w-5 text-center">{item.icon}</span>{t(item.key)}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 pb-3"><LanguageSwitcher /></div>
      <div className="px-4 py-4 border-t border-white/10">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold text-ink font-display font-bold flex items-center justify-center">{user.fullName.charAt(0)}</div>
            <div className="min-w-0 flex-1"><div className="text-sm font-semibold truncate">{user.fullName}</div><div className="text-[11px] text-gold truncate">✓ {user.title ?? t("nav.member")}</div></div>
            <button onClick={logout} className="text-[11px] text-white/60 hover:text-white" aria-label="Sign out">⎋</button>
          </div>
        ) : <Link href="/login" className="block text-center bg-gold text-ink font-display font-bold text-sm py-2.5 rounded-xl hover:brightness-110">{t("nav.signIn")}</Link>}
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
        <button type="button" onClick={() => setMobileOpen(true)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="min-w-11 min-h-11 rounded-xl border border-white/20 text-xl" aria-label="Open navigation">☰</button>
      </header>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" role="presentation" onClick={() => setMobileOpen(false)}>
          <aside id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation" className="w-[min(20rem,88vw)] h-full bg-ink text-white flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setMobileOpen(false)} className="absolute top-3 right-[calc(12vw+0.75rem)] min-w-11 min-h-11 text-white" aria-label="Close navigation">×</button>
            {navigation}
          </aside>
        </div>
      )}
    </>
  );
}
