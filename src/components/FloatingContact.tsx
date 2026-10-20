"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUp, CalendarCheck, Mail, Phone } from "lucide-react";
import { getUi, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function FloatingContact({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const t = getUi(locale);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 bg-ink-950/95 backdrop-blur-xl lg:hidden">
        <a href={site.mobile.href} className="flex flex-col items-center gap-1 py-3 text-[0.7rem] font-medium text-white/80">
          <Phone className="size-5 text-gold-300" /> {t.floatCall}
        </a>
        <Link href="/booking" className="flex flex-col items-center gap-1 bg-gold-400/10 py-3 text-[0.7rem] font-medium text-gold-200">
          <CalendarCheck className="size-5" /> {t.floatBooking}
        </Link>
        <a href={`mailto:${site.email}`} className="flex flex-col items-center gap-1 py-3 text-[0.7rem] font-medium text-white/80">
          <Mail className="size-5 text-gold-300" /> {t.floatEmail}
        </a>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={t.backToTop}
        className={cn(
          "fixed bottom-8 right-8 z-40 hidden size-12 place-items-center rounded-full border border-gold-400/40 bg-ink-900/90 text-gold-300 shadow-xl backdrop-blur transition-all duration-500 hover:border-gold-300 hover:text-gold-200 lg:grid",
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <ArrowUp className="size-5" />
      </button>
    </>
  );
}
