import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, PhoneCall } from "lucide-react";
import { getUi, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

export default function CtaBand({
  locale = "el",
  title,
  text,
}: {
  locale?: Locale;
  title?: string;
  text?: string;
}) {
  const t = getUi(locale);
  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
      <Image src="/images/courthouse.jpg" alt="" fill sizes="100vw" className="object-cover opacity-25" />
      <div className="absolute inset-0 bg-linear-to-r from-ink-950 via-ink-950/90 to-ink-950/60" />
      <div className="noise pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div data-reveal>
          <p className="eyebrow">{t.ctaEyebrow}</p>
          <h2 className="mt-6 font-serif text-4xl leading-[1.1] text-white md:text-6xl">{title ?? t.ctaTitle}</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">{text ?? t.ctaText}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/booking" className="btn btn-gold">
              {t.bookAppointment} <ArrowRight className="size-4" />
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              {t.sendMessage}
            </Link>
          </div>
        </div>
        <div data-reveal style={{ ["--d" as string]: "150ms" }} className="grid gap-4">
          <a
            href={site.phone.href}
            className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:border-gold-400/50"
          >
            <span className="grid size-12 place-items-center rounded-full bg-gold-400/15 text-gold-300">
              <Phone className="size-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.2em] text-white/45">{t.switchboard}</span>
              <span className="mt-1 block font-serif text-2xl text-white group-hover:text-gold-200">{site.phone.display}</span>
            </span>
          </a>
          <a
            href={site.mobile.href}
            className="group flex items-center gap-5 rounded-2xl border border-gold-400/30 bg-gold-400/[0.06] p-6 backdrop-blur transition hover:border-gold-300"
          >
            <span className="grid size-12 place-items-center rounded-full bg-gold-400 text-ink-950">
              <PhoneCall className="size-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.2em] text-gold-200/70">{t.urgentCases}</span>
              <span className="mt-1 block font-serif text-2xl text-white group-hover:text-gold-200">{site.mobile.display}</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
