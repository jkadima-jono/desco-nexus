import type { Metadata } from "next";
import { Montserrat, Open_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
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
  title: "DESCO Nexus — Where Capital Meets Opportunity",
  description:
    "The operating system for global investment opportunities. A Desco Global platform. Integrated Solutions. Sustainable Impact.",
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
            <div className="bg-gold-soft border-b border-gold/30 px-4 py-2 text-center text-xs font-semibold text-charcoal">
              {t(locale, "login.demoNote")}
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
