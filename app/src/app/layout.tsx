import type { Metadata } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { I18nProvider } from "@/components/I18nProvider";
import { t } from "@/lib/i18n";
import ProductAnalytics from "@/components/ProductAnalytics";
import { sharedCopy } from "@/lib/translations/shared";
import { metadataBaseUrl } from "@/lib/metadata";
import { openSignupConfig } from "@/lib/openSignup";
import StructuredData from "@/components/StructuredData";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-opensans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: "DESCO Compass — Structured DRC project screening",
  description:
    "Review public DRC project records through consistent disclosure, controlled diligence and mandate-based screening.",
  icons: {
    icon: [
      { url: "/brand/desco-compass-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/desco-compass-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/brand/desco-compass-apple.png", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    type: "website",
    siteName: "DESCO Compass",
    title: "DESCO Compass — Structured DRC project screening",
    description: "Review public DRC project records through consistent disclosure and controlled diligence.",
    images: [{ url: "/brand/desco-coin.png", width: 400, height: 400, alt: "DESCO Compass seal" }],
  },
  twitter: {
    card: "summary",
    title: "DESCO Compass — Structured DRC project screening",
    description: "Review public DRC project records through consistent disclosure and controlled diligence.",
    images: ["/brand/desco-coin.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();
  const locale = await getLocale();
  const copy = sharedCopy(locale);
  return (
    <html lang={locale}>
      <body className={`${poppins.variable} ${openSans.variable} min-h-screen`}>
        <StructuredData data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "DESCO Global",
            url: metadataBaseUrl().toString(),
            logo: new URL("/brand/desco-coin.png", metadataBaseUrl()).toString(),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "DESCO Compass",
            url: metadataBaseUrl().toString(),
            publisher: { "@type": "Organization", name: "DESCO Global" },
          },
        ]} />
        <a href="#main-content" className="skip-link">{copy.skipToContent}</a>
        <I18nProvider locale={locale}>
        <ProductAnalytics />
        <AppShell
          user={user ? { fullName: user.fullName, title: user.title, role: user.role } : null}
          demoBanner={t(locale, "system.demoBanner")}
          signupEnabled={openSignupConfig().enabled}
        >
          {children}
        </AppShell>
        </I18nProvider>
      </body>
    </html>
  );
}
