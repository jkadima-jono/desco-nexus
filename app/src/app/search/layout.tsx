import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: `${t(locale, "search.title")} — DESCO Compass`,
    description: t(locale, "search.subtitle"),
    robots: { index: false, follow: false },
  };
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
