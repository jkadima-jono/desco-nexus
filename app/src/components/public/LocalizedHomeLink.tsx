"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function LocalizedHomeLink() {
  const { t } = useI18n();
  return (
    <Link href="/" className="min-h-11 content-center hover:text-white">
      {t("common.home")}
    </Link>
  );
}
