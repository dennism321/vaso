import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import CtaBand from "@/components/CtaBand";
import { AreaIcon } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import { practiceAreas } from "@/lib/practice-areas";

export const metadata: Metadata = {
  title: "Τομείς Δικαίου",
  description:
    "Ποινικό δίκαιο, επιχειρηματικό, τραπεζικό, οικογενειακό δίκαιο, ακίνητα, ηλεκτρονικό έγκλημα, διοικητικό δίκαιο και διαμεσολάβηση.",
  alternates: { canonical: "/practice-areas" },
};

export default function PracticeAreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Τομείς Δικαίου"
        title="Εξειδίκευση που καλύπτει κάθε πτυχή της υπόθεσής σας"
        description="Με πυρήνα το ποινικό δίκαιο και ομάδα με συμπληρωματικές γνώσεις, προσφέρουμε ολοκληρωμένη νομική υποστήριξη σε ιδιώτες και επιχειρήσεις."
        crumbs={[{ label: "Τομείς Δικαίου" }]}
      />
      <section className="py-24 lg:py-32">
        <div className="container-x grid gap-8 md:grid-cols-2">
          {practiceAreas.map((area, i) => (
            <article
              key={area.slug}
              data-reveal
              style={{ ["--d" as string]: `${(i % 2) * 100}ms` }}
              className={`group relative flex flex-col overflow-hidden rounded-[2rem] border p-8 transition duration-500 hover:-translate-y-1 md:p-10 ${i === 0 ? "border-ink-950 bg-ink-950 md:col-span-2" : "border-cream-200 bg-white hover:border-gold-300 hover:shadow-[0_30px_60px_-35px_rgba(8,14,28,0.35)]"}`}
            >
              <div className={i === 0 ? "grid gap-10 lg:grid-cols-[1.2fr_1fr]" : ""}>
                <div>
                  <div className="flex items-center gap-5">
                    <span
                      className={`grid size-16 place-items-center rounded-2xl ${i === 0 ? "bg-linear-to-br from-gold-200 to-gold-500 text-ink-950" : "border border-gold-400/30 bg-gold-400/10 text-gold-600"}`}
                    >
                      <AreaIcon name={area.icon} className="size-7" />
                    </span>
                    <span className={`font-serif text-sm ${i === 0 ? "text-white/40" : "text-ink-400"}`}>0{i + 1}</span>
                  </div>
                  <h2 className={`mt-8 font-serif text-3xl md:text-4xl ${i === 0 ? "text-white" : "text-ink-900"}`}>
                    <Link href={`/practice-areas/${area.slug}`} className="after:absolute after:inset-0">
                      {area.title}
                    </Link>
                  </h2>
                  <p className={`mt-4 leading-relaxed ${i === 0 ? "text-lg text-white/60" : "text-ink-500"}`}>{area.short}</p>
                </div>
                <ul className={`grid gap-3 ${i === 0 ? "content-center sm:grid-cols-1" : "mt-8"}`}>
                  {area.services.slice(0, i === 0 ? 6 : 4).map((service) => (
                    <li key={service} className={`flex items-start gap-3 text-sm ${i === 0 ? "text-white/75" : "text-ink-600"}`}>
                      <Check className={`mt-0.5 size-4 shrink-0 ${i === 0 ? "text-gold-300" : "text-gold-600"}`} />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
              <span
                className={`mt-10 flex items-center gap-2 text-sm font-semibold ${i === 0 ? "text-gold-300" : "text-ink-900"}`}
              >
                Αναλυτικά <ArrowUpRight className="size-4 text-gold-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </article>
          ))}
        </div>
      </section>
      <CtaBand title="Δεν είστε σίγουροι ποιος τομέας αφορά την υπόθεσή σας;" text="Περιγράψτε μας την περίπτωσή σας και θα σας κατευθύνουμε στον κατάλληλο συνεργάτη της ομάδας μας." />
    </>
  );
}
