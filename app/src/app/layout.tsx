import type { Metadata } from "next";
import { Montserrat, Open_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { I18nProvider } from "@/components/I18nProvider";
import { t } from "@/lib/i18n";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DESCO Nexus — Structured African investment opportunities",
  description:
    "Review structured African investment opportunities with clear disclosure, sponsor-controlled diligence, and mandate-based screening.",
  icons: { icon: "/brand/desco-coin.png" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`${montserrat.variable} ${openSans.variable} ${playfair.variable} min-h-screen`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <I18nProvider locale={locale}>
        <div className={user ? "flex min-h-screen" : "min-h-screen"}>
          {user ? (
            <Sidebar user={{ fullName: user.fullName, title: user.title, role: user.role }} />
          ) : (
            <PublicHeader />
          )}
          <main id="main-content" tabIndex={-1} className={`min-w-0 flex-1 flex min-h-screen flex-col ${user ? "pt-16 lg:pt-0" : ""}`}>
            <div className="border-b border-gold/25 bg-[#171f27] px-4 py-2 text-center text-xs leading-5 text-white/75">
              {t(locale, "system.demoBanner")}
            </div>
            <div className="flex-1">{children}</div>
            <Footer />
          </main>
        </div>
        </I18nProvider>
      </body>
    </html>
  );
}
