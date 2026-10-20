import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Smartphone } from "lucide-react";
import Logo from "@/components/Logo";
import NewsletterForm from "@/components/NewsletterForm";
import { FacebookIcon, YoutubeIcon } from "@/components/Icons";
import { getOfficeLinks, getUi, type Locale } from "@/lib/i18n";
import type { PracticeArea } from "@/lib/practice-areas";
import { site } from "@/lib/site";
import { localePath } from "@/lib/paths";

export default function Footer({ locale, areas }: { locale: Locale; areas: PracticeArea[] }) {
  const year = new Date().getFullYear();
  const t = getUi(locale);
  const officeLinks = getOfficeLinks(locale);
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white/65">
      <div className="gold-line" />
      <div className="noise pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="container-x relative grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo subtitle={t.logoSubtitle} locale={locale} />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">{t.footerBlurb}</p>
          <div className="mt-8 flex gap-3">
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid size-10 place-items-center rounded-full border border-white/15 transition hover:border-gold-400 hover:text-gold-300"
            >
              <FacebookIcon className="size-4" />
            </a>
            <a
              href={site.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="grid size-10 place-items-center rounded-full border border-white/15 transition hover:border-gold-400 hover:text-gold-300"
            >
              <YoutubeIcon className="size-4" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">{t.navPractice}</h3>
          <ul className="mt-6 space-y-3 text-sm">
            {areas.map((area) => (
              <li key={area.slug}>
                <Link href={localePath(locale, `/practice-areas/${area.slug}`)} className="transition hover:text-gold-200">
                  {area.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">{t.footerOffice}</h3>
          <ul className="mt-6 space-y-3 text-sm">
            {officeLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-gold-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">{t.footerContact}</h3>
          <ul className="mt-6 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" />
              <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-gold-200">
                {site.address.street}
                <br />
                {t.area}, {site.address.postalCode} {t.city}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold-400" />
              <a href={site.phone.href} className="hover:text-gold-200">
                {site.phone.display}
              </a>
            </li>
            <li className="flex gap-3">
              <Smartphone className="mt-0.5 size-4 shrink-0 text-gold-400" />
              <a href={site.mobile.href} className="hover:text-gold-200">
                {site.mobile.display}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-gold-400" />
              <a href={`mailto:${site.email}`} className="hover:text-gold-200">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold-400" />
              <span>{t.hoursShort}</span>
            </li>
          </ul>
          <div className="mt-8">
            <p className="mb-3 text-sm text-white/80">{t.footerNewsletter}</p>
            <NewsletterForm locale={locale} />
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-4 pb-24 pt-6 text-xs text-white/40 lg:flex-row lg:items-center lg:justify-between lg:pb-6">
          <p>
            © {year} {site.name}. {t.footerRights}
          </p>
          <p className="max-w-xl lg:text-center">{t.footerDisclaimer}</p>
          <div className="flex gap-5">
            <Link href={localePath(locale, "/privacy")} className="hover:text-gold-200">
              {t.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
