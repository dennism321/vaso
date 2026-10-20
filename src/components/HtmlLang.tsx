"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

/** Keeps <html lang> in sync when moving between the Greek and English pages. */
export default function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
