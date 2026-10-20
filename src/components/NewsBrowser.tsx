"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import PageHero from "@/components/PageHero";
import NewsTabs from "@/components/NewsTabs";
import PostCard from "@/components/PostCard";
import type { PostSummary } from "@/lib/data";
import { basePath } from "@/lib/paths";
import { cn, normalizeSearch } from "@/lib/utils";

const PER_PAGE = 9;

/** An article summary plus its accent-free text (title, excerpt, body) for searching. */
export type NewsItem = PostSummary & { searchText: string };

type Filters = { q: string; category: string; page: number };

function readUrl(): Filters {
  const sp = new URLSearchParams(window.location.search);
  return {
    q: (sp.get("q") ?? "").trim().slice(0, 80),
    category: (sp.get("category") ?? "").trim().slice(0, 80),
    page: Math.max(1, Number.parseInt(sp.get("page") ?? "", 10) || 1),
  };
}

function toUrl({ q, category, page }: Filters) {
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (category) sp.set("category", category);
  if (page > 1) sp.set("page", String(page));
  const s = sp.toString();
  return `${basePath}/news${s ? `?${s}` : ""}`;
}

export default function NewsBrowser({
  posts,
  categories,
}: {
  posts: NewsItem[];
  categories: { category: string; count: number }[];
}) {
  const [filters, setFilters] = useState<Filters>({ q: "", category: "", page: 1 });
  const [draft, setDraft] = useState("");

  // Pick up ?q= / ?category= / ?page= from shared links, and follow back/forward.
  useEffect(() => {
    const sync = () => {
      const next = readUrl();
      setFilters(next);
      setDraft(next.q);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  function go(next: Partial<Filters>, scroll = false) {
    const merged = { ...filters, page: 1, ...next };
    setFilters(merged);
    window.history.pushState(null, "", toUrl(merged));
    if (scroll) document.getElementById("news-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const { q, category, page } = filters;
  const matches = useMemo(() => {
    const needle = normalizeSearch(q);
    return posts.filter((p) => (!category || p.category === category) && (!needle || p.searchText.includes(needle)));
  }, [posts, q, category]);

  const total = matches.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const current = Math.min(page, totalPages);
  const items = matches.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const filtered = Boolean(q || category);
  const [featured, ...rest] = !filtered && current === 1 ? items : [undefined, ...items];
  const allCount = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <>
      <PageHero
        eyebrow="Αρθρογραφία & ΜΜΕ"
        title="Γνώση που σας προστατεύει"
        description="Κατανοητοί νομικοί οδηγοί, αναλύσεις επικαιρότητας και οι παρεμβάσεις μας στα μέσα ενημέρωσης."
        crumbs={[{ label: "Αρθρογραφία" }]}
      >
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            go({ q: draft.trim().slice(0, 80) }, true);
          }}
          className="flex max-w-xl overflow-hidden rounded-full border border-white/15 bg-white/[0.06] backdrop-blur focus-within:border-gold-400/70"
        >
          <label htmlFor="news-q" className="sr-only">
            Αναζήτηση
          </label>
          <span className="grid place-items-center pl-5 text-white/50">
            <Search className="size-5" />
          </span>
          <input
            id="news-q"
            name="q"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Αναζήτηση άρθρων…"
            className="min-w-0 flex-1 bg-transparent px-4 py-4 text-white placeholder:text-white/40 focus:outline-none"
          />
          <button type="submit" className="btn btn-gold btn-sm m-1.5">
            Αναζήτηση
          </button>
        </form>
      </PageHero>

      <section id="news-list" className="scroll-mt-24 py-16 lg:py-24">
        <div className="container-x">
          <NewsTabs active="/news" />
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
            <button
              type="button"
              onClick={() => go({ category: "" })}
              aria-pressed={!category}
              className={cn(
                "shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition",
                !category ? "border-ink-900 bg-ink-900 text-white" : "border-cream-300 text-ink-600 hover:border-gold-400",
              )}
            >
              Όλα <span className="ml-1 opacity-60">{allCount}</span>
            </button>
            {categories.map((c) => (
              <button
                type="button"
                key={c.category}
                onClick={() => go({ category: c.category })}
                aria-pressed={category === c.category}
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
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-ink-500" aria-live="polite">
              <span>
                {total} {total === 1 ? "αποτέλεσμα" : "αποτελέσματα"}
                {q && (
                  <>
                    {" "}
                    για «<strong className="text-ink-900">{q}</strong>»
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  go({ q: "", category: "" });
                }}
                className="flex items-center gap-1 rounded-full bg-cream-100 px-3 py-1 text-ink-700 hover:bg-cream-200"
              >
                <X className="size-3.5" /> Καθαρισμός
              </button>
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
                  <PostCard post={featured} large />
                </div>
              )}
              <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {rest.map(
                  (post, i) =>
                    post && (
                      <div key={post.id} data-reveal style={{ ["--d" as string]: `${(i % 3) * 90}ms` }}>
                        <PostCard post={post} />
                      </div>
                    ),
                )}
              </div>
            </>
          )}

          {totalPages > 1 && (
            <nav className="mt-16 flex items-center justify-center gap-2" aria-label="Σελιδοποίηση">
              <button
                type="button"
                onClick={() => go({ page: current - 1 }, true)}
                disabled={current <= 1}
                aria-label="Προηγούμενη σελίδα"
                className="grid size-11 place-items-center rounded-full border border-cream-300 text-ink-700 transition hover:border-gold-400 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => go({ page: n }, true)}
                  aria-current={n === current ? "page" : undefined}
                  className={cn(
                    "grid size-11 place-items-center rounded-full text-sm font-semibold transition",
                    n === current ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-cream-100",
                  )}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => go({ page: current + 1 }, true)}
                disabled={current >= totalPages}
                aria-label="Επόμενη σελίδα"
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
