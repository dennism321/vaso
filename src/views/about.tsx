import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Quote } from "lucide-react";
import CtaBand from "@/components/CtaBand";
import { AreaIcon } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { getUi } from "@/lib/i18n";
import {
  getCredentials,
  getNotableCases,
  getTeam,
  getTimeline,
  getValues,
} from "@/lib/site";
import { localePath } from "@/lib/paths";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Το Γραφείο & η Ομάδα",
  description:
    "Γνωρίστε τη Βάσω Ζ. Πανταζή, δικηγόρο παρ’ Αρείω Πάγω, και την ομάδα του γραφείου. Πάνω από 20 χρόνια εμπειρίας στο ποινικό δίκαιο.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage({ locale }: { locale: Locale }) {
  const t = getUi(locale);
  const credentials = getCredentials(locale);
  const notableCases = getNotableCases(locale);
  const team = getTeam(locale);
  const timeline = getTimeline(locale);
  const values = getValues(locale);
  const en = locale === "en";
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t.navAbout}
        title={
          en ? (
            <>
              A passion for justice, <span className="text-gold-gradient italic">since 2004</span>.
            </>
          ) : (
            <>
              Πάθος για τη δικαιοσύνη, <span className="text-gold-gradient italic">από το 2004</span>.
            </>
          )
        }
        description={
          en
            ? "A law firm built in the courtroom, with criminal law at its core and personal attention to every case as a standing value."
            : "Ένα δικηγορικό γραφείο που χτίστηκε στις αίθουσες των δικαστηρίων, με πυρήνα το ποινικό δίκαιο και σταθερή αξία την προσωπική ενασχόληση με κάθε υπόθεση."
        }
        image="/images/office.jpg"
        crumbs={[{ label: t.navAbout }]}
      />

      {/* BIO */}
      <section className="py-24 lg:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <div data-reveal className="relative lg:sticky lg:top-32 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink-950">
              <Image src="/images/consultation.jpg" alt="Συνάντηση με εντολέα στο γραφείο" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover opacity-90" />
              <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="font-serif text-3xl text-white">Βάσω Ζ. Πανταζή</p>
                <p className="mt-1 text-sm uppercase tracking-[0.2em] text-gold-300">Δικηγόρος παρ’ Αρείω Πάγω</p>
              </div>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow={en ? "Short biography" : "Σύντομο βιογραφικό"}
              title="Η Βάσω Ζ. Πανταζή"
            />
            <div data-reveal className="mt-8 space-y-6 text-lg leading-relaxed text-ink-500">
              {en ? (
                <>
                  <p>
                    Vaso Z. Pantazi was born in Athens. She graduated from the Zosimaia School of Ioannina and
                    studied at the Law School of the University of Athens.
                  </p>
                  <p>
                    From 2004 to 2014 she worked as lead counsel at Alexis Kougias’s law firm, handling some of
                    the country’s most demanding criminal cases for a decade. In 2014–2015 she served as a
                    scientific associate at the Hellenic Parliament.
                  </p>
                  <p>
                    Since 2014 she has run her own law firm in Athens, with criminal law as its core. She
                    represents defendants and victims in cases of national importance, speaks at legal
                    conferences and frequently comments on legal issues in the media.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Η Βάσω Ζ. Πανταζή γεννήθηκε στην Αθήνα. Αποφοίτησε από τη Ζωσιμαία Σχολή Ιωαννίνων και σπούδασε
                    στη Νομική Σχολή του Πανεπιστημίου Αθηνών.
                  </p>
                  <p>
                    Από το 2004 έως το 2014 εργάστηκε ως επικεφαλής δικηγόρος στο δικηγορικό γραφείο του Αλέξη Κούγια,
                    όπου για μια δεκαετία χειρίστηκε ορισμένες από τις πιο απαιτητικές ποινικές υποθέσεις της χώρας.
                    Το 2014–2015 διετέλεσε επιστημονική συνεργάτις στη Βουλή των Ελλήνων.
                  </p>
                  <p>
                    Από το 2014 διατηρεί το δικό της δικηγορικό γραφείο στην Αθήνα, με κύριο αντικείμενο το ποινικό
                    δίκαιο. Εκπροσωπεί κατηγορουμένους και θύματα σε υποθέσεις πανελλήνιας εμβέλειας, συμμετέχει ως
                    ομιλήτρια σε νομικά συνέδρια και σχολιάζει συχνά νομικά ζητήματα στα μέσα ενημέρωσης.
                  </p>
                </>
              )}
            </div>
            <figure data-reveal className="mt-12 rounded-3xl bg-ink-950 p-10 text-white">
              <Quote className="size-10 text-gold-400/50" strokeWidth={1.2} />
              <blockquote className="mt-4 font-serif text-2xl leading-relaxed md:text-3xl">
                {en
                  ? "“The accused is not guilty until proven otherwise. This principle is not a formality; it is the foundation of every just society.”"
                  : "«Ο κατηγορούμενος δεν είναι ένοχος μέχρι να αποδειχθεί το αντίθετο. Αυτή η αρχή δεν είναι τυπικότητα· είναι το θεμέλιο κάθε δίκαιης κοινωνίας.»"}
              </blockquote>
              <figcaption className="mt-6 text-sm uppercase tracking-[0.2em] text-gold-300">— Βάσω Ζ. Πανταζή</figcaption>
            </figure>
            <ul data-reveal className="mt-12 grid gap-4 sm:grid-cols-2">
              {credentials.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl border border-cream-200 bg-white p-5 text-sm text-ink-700">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold-400/20 text-gold-700">
                    <Check className="size-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
        <div className="grid-lines absolute inset-0 opacity-50" />
        <div className="container-x relative">
          <SectionHeading tone="dark" align="center" eyebrow={en ? "Path" : "Διαδρομή"} title={en ? "Milestones of a career" : "Σταθμοί μιας πορείας"} />
          <ol className="relative mx-auto mt-20 max-w-4xl">
            <span className="absolute bottom-0 left-4 top-0 w-px bg-linear-to-b from-gold-400/0 via-gold-400/60 to-gold-400/0 md:left-1/2" />
            {timeline.map((item, i) => (
              <li
                key={item.title}
                data-reveal
                className={`relative mb-14 pl-14 last:mb-0 md:w-1/2 md:pl-0 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:ml-auto md:pl-16"}`}
              >
                <span
                  className={`absolute left-4 top-1.5 size-3 -translate-x-1/2 rotate-45 bg-gold-400 ring-8 ring-ink-950 ${i % 2 === 0 ? "md:left-full" : "md:left-0"}`}
                />
                <span className="font-serif text-3xl text-gold-300">{item.year}</span>
                <h3 className="mt-2 font-serif text-2xl text-white">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-white/55">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 lg:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={en ? "Our principles" : "Οι αρχές μας"} title={en ? "What guides us in every case" : "Τι μας καθοδηγεί σε κάθε υπόθεση"} />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <div key={value.title} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }} className="rounded-3xl border border-cream-200 bg-white p-8">
                <span className="grid size-12 place-items-center rounded-full bg-ink-950 text-gold-300">
                  <AreaIcon name={value.icon} className="size-5" />
                </span>
                <h3 className="mt-6 font-serif text-xl text-ink-900">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="scroll-mt-24 bg-cream-100 py-24 lg:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow={en ? "Our team" : "Η ομάδα μας"}
            title={en ? "The people behind every case" : "Οι άνθρωποι πίσω από κάθε υπόθεση"}
            description={
              en
                ? "A team of lawyers with complementary specialisms, working in a coordinated way for you."
                : "Μια ομάδα δικηγόρων με συμπληρωματικές εξειδικεύσεις, που εργάζεται συντονισμένα για εσάς."
            }
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {team.map((member, i) => (
              <article
                key={member.name}
                data-reveal
                style={{ ["--d" as string]: `${(i % 2) * 100}ms` }}
                className={`group relative overflow-hidden rounded-3xl border p-8 transition duration-500 md:p-10 ${i === 0 ? "border-ink-950 bg-ink-950 text-white" : "border-cream-200 bg-white hover:border-gold-300"}`}
              >
                <div className="flex items-start gap-6">
                  <span
                    className={`grid size-20 shrink-0 place-items-center rounded-2xl font-serif text-2xl ${i === 0 ? "bg-linear-to-br from-gold-200 to-gold-500 text-ink-950" : "bg-ink-950 text-gold-300"}`}
                  >
                    {member.initials}
                  </span>
                  <div>
                    <h3 className={`font-serif text-2xl ${i === 0 ? "text-white" : "text-ink-900"}`}>{member.name}</h3>
                    <p className={`mt-1 text-sm ${i === 0 ? "text-gold-300" : "text-gold-700"}`}>{member.role}</p>
                  </div>
                </div>
                <p className={`mt-6 leading-relaxed ${i === 0 ? "text-white/60" : "text-ink-500"}`}>{member.bio}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {member.focus.map((f) => (
                    <span
                      key={f}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${i === 0 ? "border border-white/15 text-white/70" : "bg-cream-100 text-ink-600"}`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section className="py-24 lg:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading
            eyebrow={en ? "Selected cases" : "Ενδεικτικές υποθέσεις"}
            title={en ? "Experience in cases of high public interest" : "Εμπειρία σε υποθέσεις υψηλού δημόσιου ενδιαφέροντος"}
            description={
              en
                ? "The firm has handled cases that occupied Greek and international public debate."
                : "Το γραφείο έχει χειριστεί υποθέσεις που απασχόλησαν την ελληνική και τη διεθνή κοινή γνώμη."
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {notableCases.map((item, i) => (
              <div key={item.title} data-reveal style={{ ["--d" as string]: `${i * 60}ms` }} className="rounded-2xl border border-cream-200 bg-white p-6">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold-700">{item.tag}</span>
                <h3 className="mt-3 font-serif text-lg leading-snug text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.text}</p>
              </div>
            ))}
            <Link
              href={localePath(locale, "/practice-areas")}
              data-reveal
              className="group flex flex-col justify-between rounded-2xl bg-ink-950 p-6 text-white transition hover:bg-ink-800"
            >
              <span className="font-serif text-xl">{en ? "See all practice areas" : "Δείτε όλους τους τομείς δικαίου"}</span>
              <ArrowRight className="mt-6 size-6 text-gold-300 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}
