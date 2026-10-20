import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck, Check, Phone, PhoneCall } from "lucide-react";
import CtaBand from "@/components/CtaBand";
import FaqList, { faqJsonLd } from "@/components/FaqList";
import { AreaIcon } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import PostCard from "@/components/PostCard";
import SectionHeading from "@/components/SectionHeading";
import { getPostsByCategory } from "@/lib/data";
import { getUi, type Locale } from "@/lib/i18n";
import { getLocalizedArea, getLocalizedAreas, getPracticeArea, practiceAreas } from "@/lib/practice-areas";
import { site } from "@/lib/site";
import { localePath } from "@/lib/paths";

type Props = { slug: string; locale: Locale };

export function areaSlugs() {
  return practiceAreas.map((a) => ({ slug: a.slug }));
}

export function areaMetadata(slug: string): Metadata {
  const area = getPracticeArea(slug);
  if (!area) return { title: "Ο τομέας δεν βρέθηκε" };
  return {
    title: area.title,
    description: area.short,
    alternates: { canonical: `/practice-areas/${area.slug}` },
    openGraph: { title: area.title, description: area.short },
  };
}

export default async function PracticeAreaPage({ slug, locale }: Props) {
  const t = getUi(locale);
  const area = getLocalizedArea(slug, locale);
  if (!area) notFound();

  const original = getPracticeArea(slug);
  const related = await getPostsByCategory(original?.category ?? area.category, 3);
  const others = getLocalizedAreas(locale).filter((a) => a.slug !== area.slug);
  const en = locale === "en";

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t.navPractice}
        title={area.title}
        description={area.short}
        crumbs={[{ href: "/practice-areas", label: t.navPractice }, { label: area.title }]}
      >
        <div className="flex flex-wrap gap-4">
          <Link href={localePath(locale, "/booking")} className="btn btn-gold">
            <CalendarCheck className="size-4" /> {t.bookAppointment}
          </Link>
          <a href={site.phone.href} className="btn btn-ghost">
            <Phone className="size-4" /> {site.phone.display}
          </a>
        </div>
      </PageHero>

      <section className="py-24 lg:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div data-reveal className="space-y-6 text-lg leading-relaxed text-ink-500">
              {area.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <div data-reveal className="mt-14">
              <h2 className="font-serif text-3xl text-ink-900">{en ? "What we handle" : "Τι αναλαμβάνουμε"}</h2>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {area.services.map((service) => (
                  <li key={service} className="flex items-start gap-3 rounded-2xl border border-cream-200 bg-white p-5 text-ink-700">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold-400/20 text-gold-700">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-sm leading-relaxed">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal className="mt-14 rounded-3xl bg-ink-950 p-10">
              <AreaIcon name={area.icon} className="size-9 text-gold-300" />
              <p className="mt-6 font-serif text-2xl leading-relaxed text-white md:text-3xl">{area.approach}</p>
            </div>

            <div data-reveal className="mt-16">
              <h2 className="mb-6 font-serif text-3xl text-ink-900">{en ? "FAQ" : "Συχνές ερωτήσεις"}</h2>
              <FaqList items={area.faqs} />
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-cream-200 bg-white p-8">
              <p className="eyebrow">{t.contact}</p>
              <p className="mt-4 font-serif text-2xl text-ink-900">{en ? "Speak with one of our lawyers" : "Μιλήστε με έναν δικηγόρο μας"}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                {en ? "Describe your matter and we will explain your options." : "Περιγράψτε μας την υπόθεσή σας και θα σας ενημερώσουμε για τις επιλογές σας."}
              </p>
              <div className="mt-6 grid gap-3">
                <Link href={localePath(locale, "/booking")} className="btn btn-gold w-full">
                  {t.onlineBooking} <ArrowRight className="size-4" />
                </Link>
                <a href={site.phone.href} className="btn btn-outline w-full">
                  <Phone className="size-4" /> {site.phone.display}
                </a>
              </div>
              <a href={site.mobile.href} className="mt-6 flex items-center gap-3 rounded-2xl bg-gold-100 p-4 text-sm text-ink-800">
                <PhoneCall className="size-5 shrink-0 text-gold-700" />
                <span>
                  {en ? "Urgent? Call" : "Επείγον; Καλέστε στο"} <strong className="font-semibold">{site.mobile.display}</strong>
                </span>
              </a>
            </div>
            <nav className="rounded-3xl border border-cream-200 bg-white p-6" aria-label="Άλλοι τομείς">
              <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">{en ? "Other areas" : "Άλλοι τομείς"}</p>
              <ul className="mt-3">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={localePath(locale, `/practice-areas/${other.slug}`)}
                      className="group flex items-center gap-3 rounded-xl px-2 py-3 text-sm text-ink-700 transition hover:bg-cream-100"
                    >
                      <AreaIcon name={other.icon} className="size-4 text-gold-600" />
                      <span className="flex-1">{other.title}</span>
                      <ArrowRight className="size-4 text-ink-400 opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-cream-100 py-24">
          <div className="container-x">
            <SectionHeading eyebrow={en ? "Related articles" : "Σχετικά άρθρα"} title={`${en ? "Insights" : "Αρθρογραφία"}: ${area.title}`} />
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((post) => (
                <div key={post.id} data-reveal>
                  <PostCard post={post} locale={locale} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(area.faqs)) }} />
    </>
  );
}
