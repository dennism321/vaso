"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds a subtle reveal-on-scroll animation to every element with `data-reveal`.
 * Content is fully visible without JavaScript (progressive enhancement).
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const scan = () => {
      const elements = document.querySelectorAll<HTMLElement>(
        "[data-reveal]:not([data-revealed]):not([data-observed])",
      );
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          el.setAttribute("data-revealed", "");
        } else {
          el.setAttribute("data-observed", "");
          io.observe(el);
        }
      });
      root.classList.add("reveal-ready");
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      document
        .querySelectorAll("[data-observed]:not([data-revealed])")
        .forEach((el) => el.removeAttribute("data-observed"));
    };
  }, [pathname]);

  return null;
}
