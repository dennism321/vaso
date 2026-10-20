import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { Stars } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import ReviewForm from "@/components/ReviewForm";
import { getApprovedTestimonials, getTestimonialStats } from "@/lib/data";
import { getUi } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { formatDate, initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Κριτικές Πελατών",
  description: "Διαβάστε τις εμπειρίες όσων εμπιστεύτηκαν το γραφείο μας και μοιραστείτε τη δική σας.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
  const locale = await getLocale();
  const t = getUi(locale);
  const en = locale === "en";
  const [reviews, stats] = await Promise.all([getApprovedTestimonials(100), getTestimonialStats()]);
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t.navReviews}
        title={en ? "Your trust is the greatest recognition" : "Η εμπιστοσύνη σας είναι η μεγαλύτερη αναγνώριση"}
        description={
          en
            ? "The experiences of people we have represented. Every review is published after moderation, to protect everyone."
            : "Οι εμπειρίες των ανθρώπων που εκπροσωπήσαμε. Κάθε κριτική δημοσιεύεται μετά από έλεγχο, για την προστασία όλων."
        }
        crumbs={[{ label: t.navReviews }]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_2fr]">
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-ink-950 p-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Συνολική βαθμολογία</p>
              <div className="mt-4 flex items-end gap-4">
                <span className="font-serif text-6xl">{stats.average ? stats.average.toFixed(1) : "–"}</span>
                <span className="pb-3 text-sm text-white/50">/ 5</span>
              </div>
              <Stars rating={stats.average} className="mt-3 text-white" />
              <p className="mt-3 text-sm text-white/50">Βάσει {stats.total} κριτικών</p>
              <div className="mt-8 space-y-2.5">
                {distribution.map((d) => (
                  <div key={d.star} className="flex items-center gap-3 text-xs text-white/60">
                    <span className="w-3">{d.star}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <span
                        className="block h-full rounded-full bg-gold-400"
                        style={{ width: `${reviews.length ? (d.count / reviews.length) * 100 : 0}%` }}
                      />
                    </span>
                    <span className="w-6 text-right">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div id="write" className="scroll-mt-28 rounded-3xl border border-cream-200 bg-white p-8">
              <h2 className="font-serif text-2xl text-ink-900">Γράψτε τη δική σας κριτική</h2>
              <p className="mt-2 text-sm text-ink-500">Η γνώμη σας βοηθά άλλους ανθρώπους να πάρουν τη σωστή απόφαση.</p>
              <div className="mt-6">
                <ReviewForm locale={locale} />
              </div>
            </div>
          </aside>

          <div className="columns-1 gap-6 md:columns-2 [&>*]:mb-6">
            {reviews.length === 0 && (
              <p className="rounded-3xl border border-dashed border-cream-300 p-10 text-center text-ink-500">
                Δεν υπάρχουν ακόμη δημοσιευμένες κριτικές.
              </p>
            )}
            {reviews.map((review, i) => (
              <figure
                key={review.id}
                data-reveal
                style={{ ["--d" as string]: `${(i % 2) * 80}ms` }}
                className="break-inside-avoid rounded-3xl border border-cream-200 bg-white p-8"
              >
                <div className="flex items-center justify-between">
                  <Stars rating={review.rating} className="text-ink-900" />
                  <Quote className="size-7 text-gold-400/50" strokeWidth={1.2} />
                </div>
                <blockquote className="mt-5 font-serif text-lg leading-relaxed text-ink-800">«{review.content}»</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-cream-200 pt-5">
                  <span className="grid size-10 place-items-center rounded-full bg-ink-950 font-serif text-sm text-gold-300">
                    {initials(review.name) || "•"}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-ink-900">{review.name}</span>
                    {review.role && <span className="block text-xs text-ink-400">{review.role}</span>}
                  </span>
                  <time className="text-xs text-ink-400" dateTime={review.createdAt.toISOString()}>
                    {formatDate(review.createdAt)}
                  </time>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
