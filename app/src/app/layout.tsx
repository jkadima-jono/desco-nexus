import type { Metadata } from "next";
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
    images: [{ url: "/brand/desco-compass-logo.jpg", width: 800, height: 800, alt: "Official DESCO Compass logo" }],
  },
  twitter: {
    card: "summary",
    title: "DESCO Compass — Structured DRC project screening",
    description: "Review public DRC project records through consistent disclosure and controlled diligence.",
    images: ["/brand/desco-compass-logo.jpg"],
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
      <body className="min-h-screen">
        <StructuredData data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "DESCO Global",
            url: metadataBaseUrl().toString(),
            logo: new URL("/brand/desco-compass-logo.jpg", metadataBaseUrl()).toString(),
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
          demoMode={process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_DEMO_MODE !== "false"}
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
