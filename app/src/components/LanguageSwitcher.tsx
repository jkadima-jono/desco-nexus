"use client";

import { LOCALES, LOCALE_LABELS, LOCALE_COOKIE } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";

export default function LanguageSwitcher() {
  const { locale } = useI18n();

  const change = (next: string) => {
    document.cookie =
      LOCALE_COOKIE + "=" + next + "; path=/; max-age=" + 60 * 60 * 24 * 365;
    window.location.reload();
  };

  return (
    <select
      value={locale}
      onChange={(e) => change(e.target.value)}
      aria-label="Language"
      className="w-full bg-white/10 text-white/80 text-xs rounded-lg px-2.5 py-2 outline-none cursor-pointer hover:bg-white/15 [&>option]:text-charcoal"
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_LABELS[l]}
        </option>
      ))}
    </select>
  );
}
