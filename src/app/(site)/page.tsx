import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Award, CalendarCheck, Phone, PhoneCall, ShieldCheck } from "lucide-react";
import CountUp from "@/components/CountUp";
import CtaBand from "@/components/CtaBand";
import FaqList, { faqJsonLd } from "@/components/FaqList";
import { AreaIcon, Stars } from "@/components/Icons";
import PostCard from "@/components/PostCard";
import SectionHeading from "@/components/SectionHeading";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { getApprovedTestimonials, getLatestPosts, getTestimonialStats } from "@/lib/data";
import { getUi, homeCopy } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getLocalizedAreas } from "@/lib/practice-areas";
import {
  getCredentials,
  getFaqs,
  getNotableCases,
  getProcessSteps,
  getStats,
  getValues,
  site,
} from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const locale = await getLocale();
  const t = getUi(locale);
  const h = homeCopy[locale];
  const stats = getStats(locale);
  const credentials = getCredentials(locale);
  const values = getValues(locale);
  const notableCases = getNotableCases(locale);
  const processSteps = getProcessSteps(locale);
  const faqs = getFaqs(locale);
  const practiceAreas = getLocalizedAreas(locale);
  const [posts, testimonials, rating] = await Promise.all([
    getLatestPosts(3),
    getApprovedTestimonials(9),
    getTestimonialStats(),
  ]);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink-950">
        <Image
          src="/images/hero.jpg"
          alt={h.heroImageAlt}
          fill
          preload
          sizes="100vw"
          className="animate-slow-zoom object-cover object-[70%_center] opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-r from-ink-950 via-ink-950/80 to-ink-950/10" />
        <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-transparent to-ink-950/50" />
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.06]" />

        <div className="container-x relative pb-14 pt-40 lg:pb-20">
          <div className="max-w-3xl">
            <p className="eyebrow animate-fade-up">{h.heroEyebrow}</p>
            <h1 className="mt-7 animate-fade-up font-serif text-5xl leading-[1.04] text-white [animation-delay:120ms] sm:text-6xl lg:text-[5.4rem]">
              {h.heroBefore}
              <span className="text-gold-gradient italic">{h.heroAccent}</span>
              {h.heroAfter}
            </h1>
            <p className="mt-8 max-w-xl animate-fade-up text-lg leading-relaxed text-white/65 [animation-delay:240ms]">
              {h.heroLead}
            </p>
            <div className="mt-10 flex animate-fade-up flex-wrap gap-4 [animation-delay:360ms]">
              <Link href="/booking" className="btn btn-gold">
                <CalendarCheck className="size-4" /> {t.bookAppointment}
              </Link>
              <a href={site.phone.href} className="btn btn-ghost">
                <Phone className="size-4" /> {site.phone.display}
              </a>
            </div>
          </div>

          <dl className="mt-20 grid animate-fade-up grid-cols-2 border-t border-white/10 [animation-delay:520ms] lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`py-7 pr-6 ${i % 2 === 1 ? "pl-6 lg:pl-8" : ""} ${i > 0 ? "lg:border-l lg:border-white/10 lg:pl-8" : ""} ${i === 1 ? "border-l border-white/10" : ""} ${i === 3 ? "border-l border-white/10" : ""}`}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-serif text-4xl text-white md:text-5xl">
                    <CountUp to={stat.value} suffix={stat.suffix} animate={!stat.noAnimate} />
                  </span>
                  <span className="mt-2 block text-sm text-white/50">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- URGENT STRIP ---------------- */}
      <section className="relative overflow-hidden bg-linear-to-r from-gold-300 via-gold-400 to-gold-500 text-ink-950">
        <div className="container-x flex flex-col items-start justify-between gap-4 py-5 md:flex-row md:items-center">
          <p className="flex items-center gap-3 text-sm font-medium md:text-base">
            <ShieldCheck className="size-5 shrink-0" />
            {h.urgentStrip}
          </p>
          <a
            href={site.mobile.href}
            className="flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-semibold text-gold-200 transition hover:bg-ink-800"
          >
            <PhoneCall className="size-4" /> {h.urgentCta}: {site.mobile.display}
          </a>
        </div>
      </section>

      {/* ---------------- ABOUT INTRO ---------------- */}
      <section className="relative overflow-hidden py-24 lg:py-36">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div data-reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src="/images/office.jpg"
                alt={h.officeAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink-950/50 to-transparent" />
            </div>
            <div className="absolute -bottom-8 -right-4 max-w-[17rem] animate-float rounded-2xl border border-gold-300/40 bg-ink-950 p-6 shadow-2xl sm:-right-8">
              <Award className="size-8 text-gold-300" strokeWidth={1.3} />
              <p className="mt-4 font-serif text-xl leading-snug text-white">{h.supremeCourt}</p>
              <p className="mt-2 text-sm text-white/55">{h.memberships}</p>
            </div>
            <div className="absolute -left-6 -top-6 -z-10 size-40 rounded-full bg-gold-300/30 blur-3xl" />
          </div>

          <div>
            <SectionHeading
              eyebrow={h.aboutEyebrow}
              title={
                <>
                  {h.aboutTitleBefore}
                  <em className="text-gold-600">{h.aboutTitleAccent}</em>
                </>
              }
            />
            <div data-reveal className="mt-8 space-y-5 text-lg leading-relaxed text-ink-500">
              <p>{h.aboutP1}</p>
              <p>{h.aboutP2}</p>
            </div>
            <ul data-reveal className="mt-10 grid gap-3 sm:grid-cols-2">
              {credentials.slice(0, 4).map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                  <span className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-gold-500" />
                  {item}
                </li>
              ))}
            </ul>
            <div data-reveal className="mt-12 flex flex-wrap items-center gap-6">
              <Link href="/about" className="btn btn-dark">
                {h.meetUs} <ArrowRight className="size-4" />
              </Link>
              <Link href="/about#team" className="text-sm font-semibold text-ink-800 underline decoration-gold-400 underline-offset-8 hover:text-gold-700">
                {h.ourTeam}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- PRACTICE AREAS ---------------- */}
      <section className="relative bg-cream-100 py-24 lg:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow={h.areasEyebrow}
              title={h.areasTitle}
              description={h.areasDesc}
            />
            <Link data-reveal href="/practice-areas" className="btn btn-outline shrink-0">
              {t.allAreas} <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-cream-200 bg-cream-200 sm:grid-cols-2 lg:grid-cols-4">
            {practiceAreas.map((area, i) => (
              <div key={area.slug} data-reveal style={{ ["--d" as string]: `${(i % 4) * 80}ms` }} className="bg-cream-50">
                <Link
                  href={`/practice-areas/${area.slug}`}
                  className="group relative flex h-full flex-col p-8 transition-colors duration-500 hover:bg-ink-950"
                >
                  <span className="flex items-center justify-between">
                    <span className="grid size-14 place-items-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-600 transition-colors duration-500 group-hover:border-gold-400/50 group-hover:text-gold-300">
                      <AreaIcon name={area.icon} className="size-6" />
                    </span>
                    <span className="font-serif text-sm text-ink-400 transition group-hover:text-white/40">
                      0{i + 1}
                    </span>
                  </span>
                  <h3 className="mt-8 font-serif text-2xl leading-snug text-ink-900 transition-colors duration-500 group-hover:text-white">
                    {area.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500 transition-colors duration-500 group-hover:text-white/60">
                    {area.short}
                  </p>
                  <span className="mt-8 flex items-center gap-2 text-sm font-semibold text-gold-700 transition-colors duration-500 group-hover:text-gold-300">
                    {t.more} <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- VALUES ---------------- */}
      <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
        <div className="grid-lines absolute inset-0 opacity-60" />
        <div className="absolute -right-40 top-0 size-[36rem] rounded-full bg-gold-500/10 blur-[120px]" />
        <div className="container-x relative grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              tone="dark"
              eyebrow={h.valuesEyebrow}
              title={h.valuesTitle}
              description={h.valuesDesc}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((value, i) => (
              <div
                key={value.title}
                data-reveal
                style={{ ["--d" as string]: `${i * 90}ms` }}
                className={`rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur ${i % 2 === 1 ? "sm:translate-y-12" : ""}`}
              >
                <span className="grid size-12 place-items-center rounded-full border border-gold-400/40 text-gold-300">
                  <AreaIcon name={value.icon} className="size-5" />
                </span>
                <h3 className="mt-6 font-serif text-2xl text-white">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-white/55">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- NOTABLE CASES ---------------- */}
      <section className="py-24 lg:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow={h.casesEyebrow}
            title={h.casesTitle}
            description={h.casesDesc}
          />
          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.25fr]">
            <div data-reveal className="relative hidden min-h-[28rem] overflow-hidden rounded-[2rem] lg:block">
              <Image src="/images/posts/courtroom.jpg" alt="" fill sizes="40vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-10">
                <p className="font-serif text-3xl leading-snug text-white">
                  «Κάθε δικογραφία κρύβει έναν άνθρωπο. Αυτόν υπερασπιζόμαστε.»
                </p>
                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-gold-300">Βάσω Ζ. Πανταζή</p>
              </div>
            </div>
            <ol className="divide-y divide-cream-200 border-y border-cream-200">
              {notableCases.map((item, i) => (
                <li key={item.title} data-reveal style={{ ["--d" as string]: `${i * 70}ms` }} className="group flex gap-6 py-7">
                  <span className="font-serif text-3xl text-gold-500/70 transition group-hover:text-gold-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold-700">{item.tag}</span>
                    <h3 className="mt-2 font-serif text-xl leading-snug text-ink-900 md:text-2xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- PROCESS ---------------- */}
      <section className="bg-cream-100 py-24 lg:py-32">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow={h.processEyebrow}
            title={h.processTitle}
            description={h.processDesc}
          />
          <div className="relative mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-linear-to-r from-transparent via-gold-400/60 to-transparent lg:block" />
            {processSteps.map((step, i) => (
              <div key={step.title} data-reveal style={{ ["--d" as string]: `${i * 120}ms` }} className="relative text-center">
                <span className="relative mx-auto grid size-16 place-items-center rounded-full border border-gold-400/50 bg-cream-50 font-serif text-2xl text-gold-700 shadow-[0_0_0_8px_var(--color-cream-100)]">
                  {i + 1}
                </span>
                <h3 className="mt-8 font-serif text-2xl text-ink-900">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink-500">{step.text}</p>
              </div>
            ))}
          </div>
          <div data-reveal className="mt-16 flex justify-center">
            <Link href="/booking" className="btn btn-gold">
              {h.startToday} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      {testimonials.length > 0 && (
        <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
          <div className="absolute -left-40 bottom-0 size-[30rem] rounded-full bg-gold-500/10 blur-[120px]" />
          <div className="container-x relative">
            <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
              <SectionHeading
                tone="dark"
                eyebrow={h.reviewsEyebrow}
                title={h.reviewsTitle}
              />
              <div data-reveal className="flex items-center gap-6">
                {rating.total > 0 && (
                  <div className="text-right">
                    <p className="font-serif text-5xl text-white">{rating.average.toFixed(1)}</p>
                    <Stars rating={rating.average} className="mt-2 text-white" />
                    <p className="mt-2 text-xs text-white/45">{rating.total} {t.reviewsCount}</p>
                  </div>
                )}
                <Link href="/reviews" className="btn btn-ghost">
                  {t.writeReview}
                </Link>
              </div>
            </div>
            <div className="mt-14">
              <TestimonialsCarousel
                items={testimonials.map(({ id, name, role, content, rating: stars }) => ({ id, name, role, content, rating: stars }))}
              />
            </div>
          </div>
        </section>
      )}

      {/* ---------------- LATEST POSTS ---------------- */}
      {posts.length > 0 && (
        <section className="py-24 lg:py-32">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <SectionHeading
                eyebrow={h.newsEyebrow}
                title={h.newsTitle}
                description={h.newsDesc}
              />
              <Link data-reveal href="/news" className="btn btn-outline shrink-0">
                {t.allArticles} <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <div key={post.id} data-reveal style={{ ["--d" as string]: `${i * 100}ms` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="scroll-mt-24 bg-cream-100 py-24 lg:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading
              eyebrow={h.faqEyebrow}
              title={h.faqTitle}
            />
            <div data-reveal className="mt-10 rounded-3xl bg-ink-950 p-8 text-white">
              <p className="font-serif text-2xl">{h.faqMore}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{h.faqMoreText}</p>
              <Link href="/contact" className="btn btn-gold btn-sm mt-6">
                {t.contact} <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div data-reveal>
            <FaqList items={faqs} />
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }} />
      </section>

      <CtaBand locale={locale} />
    </>
  );
}
