import type { Metadata } from "next";
import { FileText, Lock, PhoneCall, ShieldCheck } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import PageHero from "@/components/PageHero";
import { getUi } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getLocalizedAreas } from "@/lib/practice-areas";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Online Ραντεβού",
  description:
    "Κλείστε online ραντεβού με το δικηγορικό γραφείο: συνάντηση στο γραφείο, βιντεοκλήση ή τηλεφωνική συμβουλή.",
  alternates: { canonical: "/booking" },
};

const tips = [
  {
    icon: FileText,
    title: "Τι να έχετε μαζί σας",
    text: "Κλήσεις, κατηγορητήρια, αποφάσεις, συμβάσεις ή αλληλογραφία που σχετίζονται με την υπόθεση.",
  },
  {
    icon: Lock,
    title: "Απόλυτη εχεμύθεια",
    text: "Όσα μας εμπιστεύεστε καλύπτονται από το δικηγορικό απόρρητο, ακόμη κι αν δεν αναθέσετε την υπόθεση.",
  },
  {
    icon: ShieldCheck,
    title: "Επιβεβαίωση ραντεβού",
    text: "Θα επικοινωνήσουμε μαζί σας για να επιβεβαιώσουμε το ραντεβού και να σας δώσουμε οδηγίες.",
  },
];

export default async function BookingPage() {
  const locale = await getLocale();
  const t = getUi(locale);
  const en = locale === "en";
  const areas = getLocalizedAreas(locale);
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t.onlineBooking}
        title={en ? "Book an appointment in seconds" : "Κλείστε ραντεβού σε λίγα δευτερόλεπτα"}
        description={
          en
            ? "Choose how to meet, then a date and time. At the office, by video or by phone."
            : "Επιλέξτε τρόπο συνάντησης, ημερομηνία και ώρα. Στο γραφείο, με βιντεοκλήση ή τηλεφωνικά."
        }
        image="/images/consultation.jpg"
        crumbs={[{ label: t.onlineBooking }]}
      />
      <section className="relative z-10 -mt-10 pb-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <BookingForm locale={locale} areas={areas.map((a) => a.title)} />
          <aside className="space-y-5">
            {tips.map((tip) => (
              <div key={tip.title} className="rounded-3xl border border-cream-200 bg-white p-7">
                <tip.icon className="size-6 text-gold-600" strokeWidth={1.5} />
                <p className="mt-4 font-serif text-xl text-ink-900">{tip.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{tip.text}</p>
              </div>
            ))}
            <a href={site.mobile.href} className="flex items-center gap-4 rounded-3xl bg-ink-950 p-7 text-white transition hover:bg-ink-800">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold-400 text-ink-950">
                <PhoneCall className="size-5" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-gold-200/70">{en ? "Can't wait?" : "Δεν μπορεί να περιμένει;"}</span>
                <span className="mt-1 block font-serif text-xl">{site.mobile.display}</span>
              </span>
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}
