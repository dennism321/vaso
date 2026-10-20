import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/paths";

export default function Logo({
  className,
  compact = false,
  subtitle = "& Συνεργάτες · Δικηγόροι",
  locale = "el",
}: {
  className?: string;
  compact?: boolean;
  subtitle?: string;
  locale?: Locale;
}) {
  return (
    <Link href={localePath(locale, "/")} className={cn("group flex items-center gap-3", className)} aria-label="Βάσω Ζ. Πανταζή & Συνεργάτες">
      <span className="relative grid size-11 shrink-0 place-items-center border border-gold-400/60 font-serif text-[1.05rem] text-gold-300 transition-colors duration-500 group-hover:border-gold-300">
        <span className="absolute inset-[3px] border border-gold-400/20" />
        ΒΠ
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-serif text-[1.15rem] tracking-wide text-white">Βάσω Ζ. Πανταζή</span>
          <span className="mt-0.5 block text-[0.6rem] font-medium uppercase tracking-[0.32em] text-gold-300/80">
            {subtitle}
          </span>
        </span>
      )}
    </Link>
  );
}
