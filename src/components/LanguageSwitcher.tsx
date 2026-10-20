"use client";

import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Google Translate website translator, wired up behind a native-looking button.
 * - Loads Google's translate script lazily on first mount.
 * - Detects the current language from the `googtrans` cookie.
 * - Toggling sets the cookie (on both the current host and its parent domain) and reloads the page.
 * - Google's default top bar and branding are hidden via CSS rules in globals.css.
 */

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string,
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const COOKIE = "googtrans";
const LANGS = "el,en";

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function writeCookie(name: string, value: string, domain?: string) {
  const base = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  document.cookie = base;
  if (domain) document.cookie = `${base}; domain=${domain}`;
}

function deleteCookie(name: string, domain?: string) {
  const base = `${name}=; path=/; max-age=0`;
  document.cookie = base;
  if (domain) document.cookie = `${base}; domain=${domain}`;
}

function parentDomain(hostname: string) {
  // For "www.vasopantazi.gr" return ".vasopantazi.gr". For bare apex domains or localhost, return null.
  const parts = hostname.split(".");
  if (parts.length < 3) return null;
  if (/^\d/.test(parts[parts.length - 1])) return null; // IP-like preview hosts
  return `.${parts.slice(-2).join(".")}`;
}

function currentLang() {
  const value = readCookie(COOKIE);
  // Cookie values look like "/el/en" when English is active.
  return value && value.endsWith("/en") ? "en" : "el";
}

let initPromise: Promise<void> | null = null;

function ensureGoogleTranslateLoaded() {
  if (initPromise) return initPromise;
  initPromise = new Promise<void>((resolve) => {
    if (window.google?.translate?.TranslateElement) {
      resolve();
      return;
    }
    window.googleTranslateElementInit = () => {
      const host = document.getElementById("vp-google-translate-host");
      if (host && window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "el", includedLanguages: LANGS, autoDisplay: false },
          "vp-google-translate-host",
        );
      }
      resolve();
    };
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  });
  return initPromise;
}

export default function LanguageSwitcher({
  variant = "desktop",
  onToggle,
}: {
  variant?: "desktop" | "mobile";
  onToggle?: () => void;
}) {
  const [lang, setLang] = useState<"el" | "en">("el");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setLang(currentLang());
    void ensureGoogleTranslateLoaded().then(() => {
      if (mountedRef.current) setReady(true);
    });
    return () => {
      mountedRef.current = false;
    };
  }, []);

  function toggle() {
    if (busy) return;
    setBusy(true);
    const parent = typeof window !== "undefined" ? parentDomain(window.location.hostname) : null;
    const next = lang === "el" ? "en" : "el";
    if (next === "en") {
      writeCookie(COOKIE, "/el/en", parent ?? undefined);
    } else {
      deleteCookie(COOKIE, parent ?? undefined);
      // Google's script also reads a path-scoped cookie on the sub-domain; clear a few variants to be safe.
      document.cookie = `${COOKIE}=; path=/; max-age=0; domain=.google.com`;
    }
    onToggle?.();
    // Reload the page so Google Translate (re)applies the new language.
    window.location.reload();
  }

  const nextLabel = lang === "el" ? "EN" : "ΕΛ";
  const currentLabel = lang === "el" ? "ΕΛ" : "EN";
  const ariaLabel = lang === "el" ? "Switch to English" : "Εναλλαγή στα Ελληνικά";

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={!ready || busy}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-gold-400 hover:text-gold-300 disabled:opacity-50"
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        <Globe className="size-4 text-gold-300" />
        <span>{lang === "el" ? "English version" : "Ελληνική έκδοση"}</span>
        <span className="ml-auto rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold tracking-wider">{nextLabel}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!ready || busy}
      className={cn(
        "group relative grid size-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-gold-400 hover:text-gold-300 disabled:cursor-wait disabled:opacity-60",
      )}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Globe className="size-4" strokeWidth={1.75} />
      <span className="absolute -bottom-1 -right-1 rounded-full bg-gold-400 px-1.5 text-[0.55rem] font-bold text-ink-950 shadow-sm">
        {currentLabel}
      </span>
    </button>
  );
}

/** Hidden host element required by Google Translate to bootstrap. */
export function LanguageSwitcherRoot() {
  return (
    <>
      <div id="vp-google-translate-host" className="sr-only" aria-hidden="true" />
    </>
  );
}
