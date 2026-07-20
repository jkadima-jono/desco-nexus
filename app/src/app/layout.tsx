import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { I18nProvider } from "@/components/I18nProvider";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Open+Sans:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <I18nProvider locale={locale}>
        <div className="flex min-h-screen">
          <Sidebar
            user={user ? { fullName: user.fullName, title: user.title } : null}
          />
          <main className="flex-1 min-w-0 pt-16 lg:pt-0">{children}</main>
        </div>
        </I18nProvider>
      </body>
    </html>
  );
}
