"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

// Set when the logo is clicked on another page, so the homepage opens at the top.
let scrollTopAfterNavigation = false;

/**
 * Glide to the top of the page. Done by hand instead of `behavior: "smooth"`,
 * which browsers can ignore right after a wheel or touchpad scroll.
 */
function glideToTop() {
  const root = document.documentElement;
  const start = window.scrollY;
  if (start <= 0) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  if (reduceMotion) {
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
    return;
  }
  const duration = Math.min(700, 300 + start / 10);
  const began = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - began) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    window.scrollTo(0, Math.round(start * (1 - eased)));
    if (t < 1) requestAnimationFrame(step);
    else root.style.scrollBehavior = previous;
  };
  requestAnimationFrame(step);
}

export default function Logo({
  className,
  compact = false,
  onNavigate,
}: {
  className?: string;
  compact?: boolean;
  /** Called on click, e.g. to close the mobile menu. */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/" && scrollTopAfterNavigation) {
      scrollTopAfterNavigation = false;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    // Let the browser handle new-tab / new-window clicks.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate?.();
    if (pathname === "/") {
      // Wait for the mobile menu (if open) to close and unlock page scrolling first.
      requestAnimationFrame(() => requestAnimationFrame(glideToTop));
    } else {
      scrollTopAfterNavigation = true;
      router.push("/", { scroll: false });
    }
  }

  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("group flex min-w-0 items-center gap-3", className)}
      aria-label="Βάσω Ζ. Πανταζή & Συνεργάτες – Αρχική"
    >
      <span className="relative grid size-11 shrink-0 place-items-center border border-gold-400/60 font-serif text-[1.05rem] text-gold-300 transition-colors duration-500 group-hover:border-gold-300">
        <span className="absolute inset-[3px] border border-gold-400/20" />
        ΒΠ
      </span>
      {!compact && (
        <span className="min-w-0 leading-tight lg:whitespace-nowrap">
          <span className="block font-serif text-[1.15rem] tracking-wide text-white">Βάσω Ζ. Πανταζή</span>
          <span className="mt-0.5 block text-[0.6rem] font-medium uppercase tracking-[0.32em] text-gold-300/80">
            & Συνεργάτες · Δικηγόροι
          </span>
        </span>
      )}
    </Link>
  );
}
