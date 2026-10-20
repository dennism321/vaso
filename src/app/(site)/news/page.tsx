import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import PageHero from "@/components/PageHero";
import PostCard from "@/components/PostCard";
import { getCategories, getPosts } from "@/lib/data";
import { getUi, localizeCategory } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Αρθρογραφία & ΜΜΕ",
  description:
    "Νομικοί οδηγοί για τα δικαιώματά σας, αναλύσεις και οι παρεμβάσεις του γραφείου στα μέσα ενημέρωσης.",
  alternates: { canonical: "/news" },
};

const PER_PAGE = 9;

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function one(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function NewsPage({ searchParams }: Props) {
  const locale = await getLocale();
  const t = getUi(locale);
  const en = locale === "en";
  const sp = await searchParams;
  const q = one(sp.q).trim().slice(0, 80);
  const category = one(sp.category).trim().slice(0, 80);
  const page = Math.max(1, Number.parseInt(one(sp.page), 10) || 1);

  const [{ items, total }, categories] = await Promise.all([
    getPosts({ q: q || undefined, category: category || undefined, page, perPage: PER_PAGE }),
    getCategories(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const filtered = Boolean(q || category);
  const [featured, ...rest] = !filtered && page === 1 ? items : [undefined, ...items];
  const allCount = categories.reduce((sum, c) => sum + c.count, 0);

  const href = (params: { q?: string; category?: string; page?: number }) => {
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (params.category) search.set("category", params.category);
    if (params.page && params.page > 1) search.set("page", String(params.page));
    const s = search.toString();
    return s ? `/news?${s}` : "/news";
  };

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t.newsMedia}
        title={en ? "Knowledge that protects you" : "Γνώση που σας προστατεύει"}
        description={
          en
            ? "Clear legal guides, analysis of current affairs, and our appearances in the media."
            : "Κατανοητοί νομικοί οδηγοί, αναλύσεις επικαιρότητας και οι παρεμβάσεις μας στα μέσα ενημέρωσης."
        }
        crumbs={[{ label: t.navNews }]}
      >
        <form action="/news" className="flex max-w-xl overflow-hidden rounded-full border border-white/15 bg-white/[0.06] backdrop-blur focus-within:border-gold-400/70">
          {category && <input type="hidden" name="category" value={category} />}
          <label htmlFor="news-q" className="sr-only">
            Αναζήτηση
          </label>
          <span className="grid place-items-center pl-5 text-white/50">
            <Search className="size-5" />
          </span>
          <input
            id="news-q"
            name="q"
            defaultValue={q}
            placeholder="Αναζήτηση άρθρων…"
            className="min-w-0 flex-1 bg-transparent px-4 py-4 text-white placeholder:text-white/40 focus:outline-none"
          />
          <button type="submit" className="btn btn-gold btn-sm m-1.5">
            Αναζήτηση
          </button>
        </form>
      </PageHero>

      <section className="py-16 lg:py-24">
        <div className="container-x">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
            <Link
              href={href({ q })}
              className={cn(
                "shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition",
                !category ? "border-ink-900 bg-ink-900 text-white" : "border-cream-300 text-ink-600 hover:border-gold-400",
              )}
            >
              Όλα <span className="ml-1 opacity-60">{allCount}</span>
            </Link>
            {categories.map((c) => (
              <Link
                key={c.category}
                href={href({ q, category: c.category })}
                className={cn(
                  "shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition",
                  category === c.category
                    ? "border-ink-900 bg-ink-900 text-white"
                    : "border-cream-300 text-ink-600 hover:border-gold-400",
                )}
              >
                {c.category} <span className="ml-1 opacity-60">{c.count}</span>
              </Link>
            ))}
          </div>

          {filtered && (
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-ink-500">
              <span>
                {total} {total === 1 ? "αποτέλεσμα" : "αποτελέσματα"}
                {q && (
                  <>
                    {" "}
                    για «<strong className="text-ink-900">{q}</strong>»
                  </>
                )}
              </span>
              <Link href="/news" className="flex items-center gap-1 rounded-full bg-cream-100 px-3 py-1 text-ink-700 hover:bg-cream-200">
                <X className="size-3.5" /> Καθαρισμός
              </Link>
            </div>
          )}

          {items.length === 0 ? (
            <div className="mt-16 rounded-3xl border border-dashed border-cream-300 p-16 text-center">
              <p className="font-serif text-2xl text-ink-900">Δεν βρέθηκαν άρθρα</p>
              <p className="mt-2 text-ink-500">Δοκιμάστε διαφορετικούς όρους αναζήτησης ή άλλη κατηγορία.</p>
            </div>
          ) : (
            <>
              {featured && (
                <div data-reveal className="mt-12">
                  <PostCard post={featured} large locale={locale} />
                </div>
              )}
              <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {rest.map(
                  (post, i) =>
                    post && (
                      <div key={post.id} data-reveal style={{ ["--d" as string]: `${(i % 3) * 90}ms` }}>
                        <PostCard post={post} locale={locale} />
                      </div>
                    ),
                )}
              </div>
            </>
          )}

          {totalPages > 1 && (
            <nav className="mt-16 flex items-center justify-center gap-2" aria-label="Σελιδοποίηση">
              <Link
                href={href({ q, category, page: page - 1 })}
                aria-disabled={page <= 1}
                className={cn(
                  "grid size-11 place-items-center rounded-full border border-cream-300 text-ink-700 transition hover:border-gold-400",
                  page <= 1 && "pointer-events-none opacity-30",
                )}
              >
                <ChevronLeft className="size-4" />
              </Link>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={href({ q, category, page: n })}
                  aria-current={n === page ? "page" : undefined}
                  className={cn(
                    "grid size-11 place-items-center rounded-full text-sm font-semibold transition",
                    n === page ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-cream-100",
                  )}
                >
                  {n}
                </Link>
              ))}
              <Link
                href={href({ q, category, page: page + 1 })}
                aria-disabled={page >= totalPages}
                className={cn(
                  "grid size-11 place-items-center rounded-full border border-cream-300 text-ink-700 transition hover:border-gold-400",
                  page >= totalPages && "pointer-events-none opacity-30",
                )}
              >
                <ChevronRight className="size-4" />
              </Link>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
