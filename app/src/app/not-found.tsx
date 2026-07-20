import Link from "next/link";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getLocale();
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/desco-coin.png"
          alt=""
          className="w-16 h-16 rounded-full mx-auto mb-5 opacity-80"
        />
        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-2">
          {t(locale, "notFound.title")}
        </h1>
        <p className="text-sm text-wgray mb-6">{t(locale, "notFound.body")}</p>
        <Link
          href="/"
          className="inline-block bg-gold text-ink font-display font-bold text-sm px-6 py-3 rounded-xl hover:brightness-110"
        >
          {t(locale, "notFound.cta")}
        </Link>
      </div>
    </div>
  );
}
