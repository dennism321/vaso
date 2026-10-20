"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Clock, Mail, Menu, Phone, PhoneCall, X } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import Logo from "@/components/Logo";
import { AreaIcon, FacebookIcon, YoutubeIcon } from "@/components/Icons";
import { getMainNav, getUi, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type AreaLink = { slug: string; title: string; icon: string; short: string };

export default function Header({ areas, locale }: { areas: AreaLink[]; locale: Locale }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const t = getUi(locale);
  const nav = getMainNav(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500",
        scrolled || open
          ? "bg-ink-950/90 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div
        className={cn(
          "hidden overflow-hidden border-b border-white/10 transition-all duration-500 lg:block",
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
        )}
      >
        <div className="container-x flex h-10 items-center justify-between text-xs text-white/55">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Clock className="size-3.5 text-gold-400" /> {t.hoursShort}
            </span>
            <a href={`mailto:${site.email}`} className="flex items-center gap-2 transition hover:text-gold-300">
              <Mail className="size-3.5 text-gold-400" /> {site.email}
            </a>
          </div>
          <div className="flex items-center gap-5">
            <a href={site.mobile.href} className="flex items-center gap-2 text-gold-200/90 transition hover:text-gold-100">
              <PhoneCall className="size-3.5" /> {t.urgentCase}: {site.mobile.display}
            </a>
            <LanguageToggle locale={locale} variant="bar" />
            <span className="h-3 w-px bg-white/15" />
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition hover:text-gold-300">
              <FacebookIcon className="size-4" />
            </a>
            <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition hover:text-gold-300">
              <YoutubeIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="container-x flex h-20 items-center justify-between gap-4 lg:gap-6">
        <Logo subtitle={t.logoSubtitle} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t.mainNavAria}>
          {nav.map((item) =>
            item.href === "/practice-areas" ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive(item.href) ? "text-gold-300" : "text-white/80 hover:text-white",
                  )}
                >
                  {item.label}
                  <ChevronDown className="size-3.5 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-1/2 top-full w-[44rem] -translate-x-1/2 translate-y-3 pt-4 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-2xl backdrop-blur-xl">
                    <div className="grid grid-cols-2 gap-1 p-3">
                      {areas.map((area) => (
                        <Link
                          key={area.slug}
                          href={`/practice-areas/${area.slug}`}
                          className="group/item flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.04]"
                        >
                          <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-gold-400/25 bg-gold-400/10 text-gold-300 transition group-hover/item:border-gold-300/60">
                            <AreaIcon name={area.icon} className="size-[18px]" />
                          </span>
                          <span>
                            <span className="block text-sm font-medium text-white">{area.title}</span>
                            <span className="mt-0.5 line-clamp-1 block text-xs text-white/45">{area.short}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-6 py-4 text-sm">
                      <span className="text-white/55">{t.cantFindArea}</span>
                      <Link href="/contact" className="flex items-center gap-2 font-medium text-gold-300 hover:text-gold-200">
                        {t.contactUs} <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive(item.href) ? "text-gold-300" : "text-white/80 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={site.phone.href}
            className="hidden items-center gap-2 text-sm font-medium text-white/80 transition hover:text-gold-300 xl:flex"
          >
            <span className="grid size-9 place-items-center rounded-full border border-white/15">
              <Phone className="size-4" />
            </span>
            {site.phone.display}
          </a>
          <div className="lg:hidden">
            <LanguageToggle locale={locale} />
          </div>
          <div className="hidden lg:block">
            <LanguageToggle locale={locale} />
          </div>
          <Link href="/booking" className="btn btn-gold btn-sm hidden sm:inline-flex">
            {t.bookAppointment}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full border border-white/15 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.closeMenu : t.openMenu}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 bottom-0 top-20 overflow-y-auto bg-ink-950 transition-all duration-500 lg:hidden",
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
        )}
      >
        <div className="container-x flex min-h-full flex-col py-8">
          <nav className="flex flex-col" aria-label={t.mobileNavAria}>
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                className={cn(
                  "flex items-center justify-between border-b border-white/10 py-4 font-serif text-2xl transition-all duration-500",
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                  isActive(item.href) ? "text-gold-300" : "text-white",
                )}
              >
                {item.label}
                <ArrowRight className="size-5 text-gold-400/70" />
              </Link>
            ))}
          </nav>
          <div className="mt-8">
            <p className="eyebrow">{t.practiceAreas}</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {areas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/practice-areas/${area.slug}`}
                  onClick={close}
                  className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/80"
                >
                  <AreaIcon name={area.icon} className="size-4 text-gold-300" />
                  {area.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <LanguageToggle locale={locale} variant="menu" />
          </div>
          <div className="mt-auto grid gap-3 pt-10">
            <Link href="/booking" onClick={close} className="btn btn-gold w-full">
              {t.bookAppointment}
            </Link>
            <a href={site.mobile.href} className="btn btn-ghost w-full">
              <PhoneCall className="size-4" /> {t.urgentShort}: {site.mobile.display}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
