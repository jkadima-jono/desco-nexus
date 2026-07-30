"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import PublicHeader from "./PublicHeader";
import Sidebar from "./Sidebar";

type ShellUser = { fullName: string; title: string | null; role?: string } | null;

const WORKSPACE_PREFIXES = [
  "/admin",
  "/deals",
  "/mandates",
  "/match",
  "/messages",
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
  children,
}: {
  user: ShellUser;
  demoBanner: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const workspace = Boolean(user && isWorkspaceRoute(pathname));
  const focused = pathname === "/login";

  return (
    <div className={workspace ? "flex min-h-screen" : "min-h-screen"}>
      {!focused && (workspace && user ? <Sidebar user={user} /> : <PublicHeader user={user} />)}
      <main
        id="main-content"
        tabIndex={-1}
        className={`flex min-h-screen min-w-0 flex-1 flex-col ${workspace ? "pt-16 lg:pt-0" : ""}`}
      >
        {!focused && (
          <div className="border-b border-gold/25 bg-[#171f27] px-4 py-2 text-center text-xs leading-5 text-white/75">
            {demoBanner}
          </div>
        )}
        <div className="flex-1">{children}</div>
        {!workspace && !focused && <Footer />}
      </main>
    </div>
  );
}
