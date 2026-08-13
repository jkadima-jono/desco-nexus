import Link from "next/link";
import Button from "@/components/ui/Button";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: `${t(locale, "notFound.title")} — DESCO Compass`,
    description: t(locale, "notFound.body"),
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const locale = await getLocale();
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/desco-compass-logo.jpg"
          alt=""
          className="mx-auto mb-5 h-20 w-20 rounded-full object-cover opacity-80"
        />
        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-2">
          {t(locale, "notFound.title")}
        </h1>
        <p className="text-sm text-wgray mb-6">{t(locale, "notFound.body")}</p>
        <Button
          href="/"
          variant="solid-brand"
        >
          {t(locale, "notFound.cta")}
        </Button>
      </div>
    </div>
  );
}
