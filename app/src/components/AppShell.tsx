"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import PublicHeader from "./PublicHeader";
import Sidebar from "./Sidebar";

type ShellUser = { fullName: string; title: string | null; role?: string } | null;

const WORKSPACE_PREFIXES = [
  "/account",
  "/admin",
  "/deals",
  "/mandates",
  "/match",
  "/messages",
  "/onboarding",
  "/portfolio",
  "/saved",
  "/search",
  "/sponsor/investors",
  "/submit-project",
];

function isWorkspaceRoute(pathname: string): boolean {
  return WORKSPACE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"));
}

export default function AppShell({
  user,
  demoBanner,
  signupEnabled,
  children,
}: {
  user: ShellUser;
  demoBanner: string;
  signupEnabled: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const workspace = Boolean(user && isWorkspaceRoute(pathname));
  const focused = pathname === "/login" || pathname === "/signup" || pathname === "/auth/verify";

  return (
    <div className={workspace ? "flex min-h-screen" : "min-h-screen"}>
      {!focused && (workspace && user ? <Sidebar user={user} /> : <PublicHeader user={user} signupEnabled={signupEnabled} />)}
      <main
        id="main-content"
        tabIndex={-1}
        className={`flex min-h-screen min-w-0 flex-1 flex-col ${workspace ? "pt-16 lg:pt-0" : ""}`}
      >
        <div className="bg-desco-red px-4 py-2 text-center font-display text-[11px] font-semibold uppercase leading-4 tracking-[0.08em] text-white sm:px-6 sm:py-2.5 sm:text-sm sm:leading-5 sm:tracking-[0.12em]">
          {demoBanner}
        </div>
        <div className="flex-1">{children}</div>
        {!workspace && !focused && <Footer />}
      </main>
    </div>
  );
}
