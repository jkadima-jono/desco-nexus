import type { Metadata } from "next";
import { Montserrat, Open_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { I18nProvider } from "@/components/I18nProvider";

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
        <div className="flex min-h-screen">
          <Sidebar
            user={user ? { fullName: user.fullName, title: user.title, role: user.role } : null}
          />
          <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 pt-16 lg:pt-0 flex flex-col min-h-screen">
            <div className="border-b border-gold/25 bg-[#171f27] px-4 py-2 text-center text-[11px] leading-5 text-white/72">
              Demonstration environment. Opportunities and accounts may contain illustrative information. Nothing on this platform constitutes a securities offer or investment recommendation.
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
