"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import PageHero from "@/components/PageHero";
import PostCard from "@/components/PostCard";
import type { PostSummary } from "@/lib/data";
import { getUi, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const PER_PAGE = 9;

type Filters = { q: string; category: string; page: number };

function readFilters(): Filters {
  const sp = new URLSearchParams(window.location.search);
  return {
    q: (sp.get("q") ?? "").trim().slice(0, 80),
    category: (sp.get("category") ?? "").trim().slice(0, 80),
    page: Math.max(1, Number.parseInt(sp.get("page") ?? "", 10) || 1),
  };
}

function writeFilters({ q, category, page }: Filters) {
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (category) sp.set("category", category);
  if (page > 1) sp.set("page", String(page));
  const s = sp.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${s ? `?${s}` : ""}`);
}

/** Client-side search, category filter and paging over the articles baked into the page. */
export default function NewsBrowser({
  locale,
  posts,
  categories,
}: {
  locale: Locale;
  posts: PostSummary[];
  categories: { category: string; count: number }[];
}) {
  const t = getUi(locale);
  const en = locale === "en";
  const [filters, setFilters] = useState<Filters>({ q: "", category: "", page: 1 });
  const [draft, setDraft] = useState("");
  const { q, category, page } = filters;

  // The static HTML has no query string, so filters are read from the URL once after load.
  useEffect(() => {
    const initial = readFilters();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters(initial);
    setDraft(initial.q);
  }, []);

  function update(next: Partial<Filters>) {
    const merged = { ...filters, page: 1, ...next };
    setFilters(merged);
    writeFilters(merged);
    if (next.page) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const matching = useMemo(() => {
    const needle = q.toLocaleLowerCase("el");
    return posts.filter(
      (p) =>
        (!category || p.category === category) &&
        (!needle || `${p.title} ${p.excerpt}`.toLocaleLowerCase("el").includes(needle)),
    );
  }, [posts, q, category]);

  const total = matching.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const items = matching.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const filtered = Boolean(q || category);
  const [featured, ...rest] = !filtered && page === 1 ? items : [undefined, ...items];
  const allCount = categories.reduce((sum, c) => sum + c.count, 0);

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: draft.trim().slice(0, 80) });
          }}
          className="flex max-w-xl overflow-hidden rounded-full border border-white/15 bg-white/[0.06] backdrop-blur focus-within:border-gold-400/70"
        >
          <label htmlFor="news-q" className="sr-only">
            {en ? "Search" : "Αναζήτηση"}
          </label>
          <span className="grid place-items-center pl-5 text-white/50">
            <Search className="size-5" />
          </span>
          <input
            id="news-q"
            name="q"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={en ? "Search articles…" : "Αναζήτηση άρθρων…"}
            className="min-w-0 flex-1 bg-transparent px-4 py-4 text-white placeholder:text-white/40 focus:outline-none"
          />
          <button type="submit" className="btn btn-gold btn-sm m-1.5">
            {en ? "Search" : "Αναζήτηση"}
          </button>
        </form>
      </PageHero>

      <section className="py-16 lg:py-24">
        <div className="container-x">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
            <button
              type="button"
              onClick={() => update({ category: "" })}
              className={cn(
                "shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition",
                !category ? "border-ink-900 bg-ink-900 text-white" : "border-cream-300 text-ink-600 hover:border-gold-400",
              )}
            >
              {en ? "All" : "Όλα"} <span className="ml-1 opacity-60">{allCount}</span>
            </button>
            {categories.map((c) => (
              <button
                type="button"
                key={c.category}
                onClick={() => update({ category: c.category })}
                className={cn(
                  "shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition",
                  category === c.category
                    ? "border-ink-900 bg-ink-900 text-white"
                    : "border-cream-300 text-ink-600 hover:border-gold-400",
                )}
              >
                {c.category} <span className="ml-1 opacity-60">{c.count}</span>
              </button>
            ))}
          </div>

          {filtered && (
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-ink-500">
              <span>
                {total} {en ? (total === 1 ? "result" : "results") : total === 1 ? "αποτέλεσμα" : "αποτελέσματα"}
                {q && (
                  <>
                    {" "}
                    {en ? "for" : "για"} «<strong className="text-ink-900">{q}</strong>»
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  update({ q: "", category: "" });
                }}
                className="flex items-center gap-1 rounded-full bg-cream-100 px-3 py-1 text-ink-700 hover:bg-cream-200"
              >
                <X className="size-3.5" /> {en ? "Clear" : "Καθαρισμός"}
              </button>
            </div>
          )}

          {items.length === 0 ? (
            <div className="mt-16 rounded-3xl border border-dashed border-cream-300 p-16 text-center">
              <p className="font-serif text-2xl text-ink-900">{en ? "No articles found" : "Δεν βρέθηκαν άρθρα"}</p>
              <p className="mt-2 text-ink-500">
                {en ? "Try different search terms or another category." : "Δοκιμάστε διαφορετικούς όρους αναζήτησης ή άλλη κατηγορία."}
              </p>
            </div>
          ) : (
            <>
              {featured && (
                <div className="mt-12">
                  <PostCard post={featured} large locale={locale} />
                </div>
              )}
              <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => post && <PostCard key={post.id} post={post} locale={locale} />)}
              </div>
            </>
          )}

          {totalPages > 1 && (
            <nav className="mt-16 flex items-center justify-center gap-2" aria-label={en ? "Pagination" : "Σελιδοποίηση"}>
              <button
                type="button"
                onClick={() => update({ page: page - 1 })}
                disabled={page <= 1}
                className="grid size-11 place-items-center rounded-full border border-cream-300 text-ink-700 transition hover:border-gold-400 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => update({ page: n })}
                  aria-current={n === page ? "page" : undefined}
                  className={cn(
                    "grid size-11 place-items-center rounded-full text-sm font-semibold transition",
                    n === page ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-cream-100",
                  )}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => update({ page: page + 1 })}
                disabled={page >= totalPages}
                className="grid size-11 place-items-center rounded-full border border-cream-300 text-ink-700 transition hover:border-gold-400 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
