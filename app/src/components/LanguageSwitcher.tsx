"use client";

import { LOCALES, LOCALE_LABELS, LOCALE_COOKIE } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";
import { useState } from "react";

export default function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const [pending, setPending] = useState(false);

  const change = (next: string) => {
    setPending(true);
    document.cookie =
      LOCALE_COOKIE + "=" + encodeURIComponent(next) + "; path=/; max-age=" +
      60 * 60 * 24 * 365 + "; samesite=lax";
    // A document reload guarantees that the root server layout, page content,
    // metadata and client translation context all receive the same locale.
    window.location.reload();
  };

  return (
    <select
      value={locale}
      onChange={(e) => change(e.target.value)}
      aria-label={t("common.language")}
      disabled={pending}
      aria-busy={pending}
      className="min-h-11 w-full cursor-pointer rounded-lg bg-white/10 px-2.5 py-2 text-xs text-white/80 outline-none hover:bg-white/15 [&>option]:text-charcoal"
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_LABELS[l]}
        </option>
      ))}
    </select>
  );
}
