import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarCheck, Clock, Mail, MapPin, Phone, PhoneCall, Smartphone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { formCopy, getUi } from "@/lib/i18n";
import { getLocalizedAreas } from "@/lib/practice-areas";
import { site } from "@/lib/site";
import { localePath } from "@/lib/paths";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Επικοινωνία",
  description: `Επικοινωνήστε με το δικηγορικό γραφείο ${site.name}. ${site.fullAddress} · Τηλ. ${site.phone.display}.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ locale }: { locale: Locale }) {
  const t = getUi(locale);
  const f = formCopy[locale];
  const en = locale === "en";
  const areas = getLocalizedAreas(locale);
  const cards = [
    { icon: Phone, label: t.switchboard, value: site.phone.display, href: site.phone.href },
    { icon: Smartphone, label: en ? "Mobile – urgent" : "Κινητό – επείγοντα", value: site.mobile.display, href: site.mobile.href },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: en ? "Address" : "Διεύθυνση", value: site.fullAddress, href: site.mapLink },
  ];
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t.navContact}
        title={en ? "We are here to listen" : "Είμαστε εδώ για να σας ακούσουμε"}
        description={
          en
            ? "Call us, send a message or book online. Every communication is covered by absolute confidentiality."
            : "Τηλεφωνήστε μας, στείλτε μας μήνυμα ή κλείστε online ραντεβού. Κάθε επικοινωνία καλύπτεται από απόλυτη εχεμύθεια."
        }
        image="/images/consultation.jpg"
        crumbs={[{ label: t.navContact }]}
      />

      <section className="relative z-10 -mt-12">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <a
              key={card.label}
              href={card.href}
              {...(card.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              data-reveal
              style={{ ["--d" as string]: `${i * 70}ms` }}
              className="group rounded-3xl border border-cream-200 bg-white p-7 shadow-[0_30px_60px_-40px_rgba(8,14,28,0.45)] transition hover:-translate-y-1 hover:border-gold-300"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-ink-950 text-gold-300">
                <card.icon className="size-5" />
              </span>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">{card.label}</p>
              <p className="mt-2 flex items-start justify-between gap-2 font-medium text-ink-900">
                {card.value}
                <ArrowUpRight className="size-4 shrink-0 text-gold-500 opacity-0 transition group-hover:opacity-100" />
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div data-reveal className="rounded-[2rem] border border-cream-200 bg-white p-8 md:p-12">
            <p className="eyebrow">{f.contactFormEyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl text-ink-900">{f.contactFormTitle}</h2>
            <p className="mt-3 text-ink-500">{f.contactFormLead}</p>
            <div className="mt-10">
              <ContactForm locale={locale} areas={areas.map((a) => a.title)} />
            </div>
          </div>

          <div className="space-y-6">
            <div data-reveal className="rounded-[2rem] bg-ink-950 p-8 text-white md:p-10">
              <PhoneCall className="size-8 text-gold-300" strokeWidth={1.4} />
              <h3 className="mt-6 font-serif text-2xl">{en ? "Urgent criminal matter?" : "Επείγουσα ποινική υπόθεση;"}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {en
                  ? "If you have been arrested, are under investigation or summoned to give a statement, do not make any statement before speaking to a lawyer. Call us directly on the mobile number."
                  : "Σε περίπτωση σύλληψης, έρευνας ή κλήσης σε απολογία, μην κάνετε καμία δήλωση πριν μιλήσετε με δικηγόρο. Καλέστε μας απευθείας στο κινητό."}
              </p>
              <a href={site.mobile.href} className="btn btn-gold mt-8 w-full">
                <PhoneCall className="size-4" /> {site.mobile.display}
              </a>
            </div>

            <div data-reveal className="rounded-[2rem] border border-cream-200 bg-white p-8">
              <div className="flex items-center gap-3">
                <Clock className="size-5 text-gold-600" />
                <h3 className="font-serif text-xl text-ink-900">{en ? "Opening hours" : "Ωράριο λειτουργίας"}</h3>
              </div>
              <dl className="mt-6 divide-y divide-cream-200">
                {(en
                  ? [
                      { days: t.hoursOpen, time: "09:00 – 19:00" },
                      { days: t.hoursClosedDays, time: t.closed },
                    ]
                  : site.hours
                ).map((h) => (
                  <div key={h.days} className="flex justify-between gap-4 py-3 text-sm">
                    <dt className="text-ink-500">{h.days}</dt>
                    <dd className="font-medium text-ink-900">{h.time}</dd>
                  </div>
                ))}
              </dl>
              <Link href={localePath(locale, "/booking")} className="btn btn-outline mt-6 w-full">
                <CalendarCheck className="size-4" /> {t.onlineBooking}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x">
          <div data-reveal className="relative overflow-hidden rounded-[2rem] border border-cream-200 bg-cream-100">
            <iframe
              src={site.mapEmbed}
              title={`Χάρτης – ${site.fullAddress}`}
              className="h-[420px] w-full grayscale-[60%] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute bottom-6 left-6 max-w-xs rounded-2xl bg-ink-950/95 p-6 text-white shadow-2xl backdrop-blur">
              <p className="font-serif text-xl">{site.name}</p>
              <p className="mt-2 text-sm text-white/60">
                {site.address.street}, {site.address.area}
                <br />
                {site.address.postalCode} {site.address.city}
              </p>
              <a
                href={site.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200"
              >
                Οδηγίες πρόσβασης <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
