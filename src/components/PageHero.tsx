import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { getUi, type Locale } from "@/lib/i18n";

export default function PageHero({
  eyebrow,
  title,
  description,
  image = "/images/courthouse.jpg",
  crumbs = [],
  children,
  locale = "el",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  image?: string;
  crumbs?: { href?: string; label: string }[];
  children?: ReactNode;
  locale?: Locale;
}) {
  const t = getUi(locale);
  return (
    <section className="relative overflow-hidden bg-ink-950 pb-20 pt-36 lg:pb-28 lg:pt-48">
      <Image src={image} alt="" fill preload sizes="100vw" className="animate-slow-zoom object-cover opacity-30" />
      <div className="absolute inset-0 bg-linear-to-b from-ink-950/60 via-ink-950/85 to-ink-950" />
      <div className="grid-lines absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="noise pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div className="container-x relative">
        <nav aria-label={locale === "en" ? "Breadcrumb" : "Διαδρομή"} className="mb-10 flex flex-wrap items-center gap-2 text-xs text-white/45 animate-fade-in">
          <Link href="/" className="transition hover:text-gold-300">
            {t.homeLabel}
          </Link>
          {crumbs.map((crumb) => (
            <span key={crumb.label} className="flex items-center gap-2">
              <ChevronRight className="size-3" />
              {crumb.href ? (
                <Link href={crumb.href} className="transition hover:text-gold-300">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/70">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <p className="eyebrow animate-fade-up">{eyebrow}</p>
        <h1 className="mt-6 max-w-4xl animate-fade-up font-serif text-4xl leading-[1.08] text-white [animation-delay:120ms] md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-7 max-w-2xl animate-fade-up text-lg leading-relaxed text-white/60 [animation-delay:240ms]">
            {description}
          </p>
        )}
        {children && <div className="mt-10 animate-fade-up [animation-delay:360ms]">{children}</div>}
      </div>
    </section>
  );
}
