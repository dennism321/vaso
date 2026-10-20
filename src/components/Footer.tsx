import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Smartphone } from "lucide-react";
import Logo from "@/components/Logo";
import NewsletterForm from "@/components/NewsletterForm";
import { FacebookIcon, YoutubeIcon } from "@/components/Icons";
import { practiceAreas } from "@/lib/practice-areas";
import { site } from "@/lib/site";

const officeLinks = [
  { href: "/about", label: "Το Γραφείο" },
  { href: "/about#team", label: "Η Ομάδα μας" },
  { href: "/news", label: "Αρθρογραφία & ΜΜΕ" },
  { href: "/reviews", label: "Κριτικές πελατών" },
  { href: "/booking", label: "Online ραντεβού" },
  { href: "/contact", label: "Επικοινωνία" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white/65">
      <div className="gold-line" />
      <div className="noise pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="container-x relative grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
            Δικηγορικό γραφείο με εξειδίκευση στο ποινικό δίκαιο. Υπεράσπιση, εκπροσώπηση θυμάτων και νομική
            στρατηγική με θάρρος, γνώση και απόλυτη εχεμύθεια.
          </p>
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
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">Τομείς Δικαίου</h3>
          <ul className="mt-6 space-y-3 text-sm">
            {practiceAreas.map((area) => (
              <li key={area.slug}>
                <Link href={`/practice-areas/${area.slug}`} className="transition hover:text-gold-200">
                  {area.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">Το Γραφείο</h3>
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
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">Επικοινωνία</h3>
          <ul className="mt-6 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" />
              <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-gold-200">
                {site.address.street}
                <br />
                {site.address.area}, {site.address.postalCode} {site.address.city}
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
              <span>{site.hoursShort}</span>
            </li>
          </ul>
          <div className="mt-8">
            <p className="mb-3 text-sm text-white/80">Νομικά άρθρα στο email σας</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-4 pb-24 pt-6 text-xs text-white/40 lg:flex-row lg:items-center lg:justify-between lg:pb-6">
          <p>
            © {year} {site.name}. Με την επιφύλαξη παντός δικαιώματος.
          </p>
          <p className="max-w-xl lg:text-center">
            Το περιεχόμενο του ιστότοπου έχει αποκλειστικά ενημερωτικό χαρακτήρα και δεν αποτελεί νομική συμβουλή.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-gold-200">
              Πολιτική Απορρήτου
            </Link>
            <Link href="/admin" className="hover:text-gold-200">
              Διαχείριση
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
