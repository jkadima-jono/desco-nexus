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
      className="language-switcher min-h-11 w-full cursor-pointer"
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_LABELS[l]}
        </option>
      ))}
    </select>
  );
}
