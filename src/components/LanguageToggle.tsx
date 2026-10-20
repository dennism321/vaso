"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocaleAction } from "@/app/actions/locale";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function LanguageToggle({
  locale,
  variant = "header",
}: {
  locale: Locale;
  variant?: "header" | "bar" | "menu";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale || pending) return;
    startTransition(async () => {
      await setLocaleAction(next);
      router.refresh();
    });
  }

  const isMenu = variant === "menu";
  const isBar = variant === "bar";

  return (
    <div
      role="group"
      aria-label={locale === "en" ? "Language" : "Γλώσσα"}
      className={cn(
        "inline-flex items-center rounded-full border p-0.5",
        isBar ? "border-white/15 bg-white/[0.04]" : "border-white/20 bg-white/[0.06]",
        isMenu && "w-full justify-center p-1",
        pending && "opacity-70",
      )}
    >
      <button
        type="button"
        onClick={() => switchTo("el")}
        aria-pressed={locale === "el"}
        className={cn(
          "rounded-full font-semibold tracking-[0.14em] transition",
          isMenu ? "flex-1 px-5 py-2.5 text-sm" : "px-2.5 py-1 text-[0.7rem]",
          locale === "el" ? "bg-gold-400 text-ink-950 shadow-sm" : "text-white/70 hover:text-white",
        )}
      >
        ΕΛ
      </button>
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "rounded-full font-semibold tracking-[0.14em] transition",
          isMenu ? "flex-1 px-5 py-2.5 text-sm" : "px-2.5 py-1 text-[0.7rem]",
          locale === "en" ? "bg-gold-400 text-ink-950 shadow-sm" : "text-white/70 hover:text-white",
        )}
      >
        EN
      </button>
    </div>
  );
}
