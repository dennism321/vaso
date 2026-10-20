"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowUpRight, FileText, Mic, Play } from "lucide-react";
import { FacebookIcon, YoutubeIcon } from "@/components/Icons";
import { pressKinds, youtubeVideoId, type PressItem, type PressKind } from "@/lib/press";
import { cn, formatDate } from "@/lib/utils";

const kindLabel: Record<PressKind, string> = {
  video: "Βίντεο",
  article: "Κείμενο",
  audio: "Ήχος",
};

function when(date: string) {
  return formatDate(new Date(`${date}T12:00:00+03:00`));
}

function SourceIcon({ item, className }: { item: PressItem; className?: string }) {
  if (/youtube|youtu\.be/.test(item.url)) return <YoutubeIcon className={className} />;
  if (/facebook\.com/.test(item.url)) return <FacebookIcon className={className} />;
  if (item.kind === "audio") return <Mic className={className} strokeWidth={1.5} />;
  if (item.kind === "video") return <Play className={className} strokeWidth={1.5} />;
  return <FileText className={className} strokeWidth={1.5} />;
}

function linkLabel(item: PressItem) {
  if (item.kind === "video") return "Δείτε το βίντεο";
  if (item.kind === "audio") return "Ακούστε";
  return "Διαβάστε";
}

function FeaturedCard({ item }: { item: PressItem }) {
  const yt = youtubeVideoId(item.url);
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-cream-200 bg-white sm:flex-row lg:flex-col shadow-[0_30px_60px_-45px_rgba(8,14,28,0.55)] transition hover:-translate-y-1 hover:border-gold-300"
    >
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-ink-950 sm:aspect-auto sm:w-2/5 lg:aspect-[16/9] lg:w-auto">
        {yt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://i.ytimg.com/vi/${yt}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-ink-800 to-ink-950">
            <SourceIcon item={item} className="size-12 text-gold-300/70" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-ink-950/70 via-transparent to-transparent" />
        {item.kind === "video" && (
          <span className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-full bg-gold-400 text-ink-950 shadow-lg">
            <Play className="size-4 translate-x-px fill-current" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-gold-600">
          <SourceIcon item={item} className="size-3.5 shrink-0" />
          {item.source}
        </p>
        <p className="mt-1 text-sm text-ink-400">{when(item.date)}</p>
        <h3 className="mt-3 font-serif text-xl leading-snug text-ink-900">{item.title}</h3>
        <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-medium text-ink-700 group-hover:text-gold-600">
          {linkLabel(item)} <ArrowUpRight className="size-4" />
        </span>
      </div>
    </a>
  );
}

export default function MediaBrowser({
  items,
  youtubeChannel,
  tabs,
}: {
  items: PressItem[];
  youtubeChannel: string;
  tabs?: ReactNode;
}) {
  const [kind, setKind] = useState<PressKind | "">("");

  const filtered = useMemo(() => (kind ? items.filter((i) => i.kind === kind) : items), [items, kind]);
  const featured = useMemo(() => items.filter((i) => youtubeVideoId(i.url)).slice(0, 3), [items]);
  const showFeatured = !kind || kind === "video";
  const rest = filtered;

  const byYear = useMemo(() => {
    const groups = new Map<string, PressItem[]>();
    for (const item of rest) {
      const year = item.date.slice(0, 4);
      groups.set(year, [...(groups.get(year) ?? []), item]);
    }
    return [...groups.entries()];
  }, [rest]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const i of items) c[i.kind] = (c[i.kind] ?? 0) + 1;
    return c;
  }, [items]);

  const chip = (active: boolean) =>
    cn(
      "shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition",
      active ? "border-ink-900 bg-ink-900 text-white" : "border-cream-300 text-ink-600 hover:border-gold-400",
    );

  return (
    <section className="py-16 lg:py-24">
      <div className="container-x">
        {tabs}
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
          <button type="button" onClick={() => setKind("")} aria-pressed={!kind} className={chip(!kind)}>
            Όλα <span className="ml-1 opacity-60">{items.length}</span>
          </button>
          {pressKinds.map((k) => (
            <button
              type="button"
              key={k.id}
              onClick={() => setKind(k.id)}
              aria-pressed={kind === k.id}
              className={chip(kind === k.id)}
            >
              {k.label} <span className="ml-1 opacity-60">{counts[k.id] ?? 0}</span>
            </button>
          ))}
        </div>

        {showFeatured && featured.length > 0 && (
          <div className="mt-12">
            <p className="label">Πρόσφατα βίντεο</p>
            <div className="mt-5 grid gap-6 lg:grid-cols-3">
              {featured.map((item) => (
                <FeaturedCard key={item.url + item.date} item={item} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 space-y-14">
          {byYear.map(([year, list]) => (
            <div key={year} className="grid gap-6 lg:grid-cols-[8rem_1fr]">
              <h2 className="font-serif text-4xl text-gold-500 lg:sticky lg:top-28 lg:self-start">{year}</h2>
              <ul className="divide-y divide-cream-200 border-y border-cream-200">
                {list.map((item) => (
                  <li key={item.url + item.date}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group grid gap-x-6 gap-y-2 py-5 sm:grid-cols-[9.5rem_1fr_auto] sm:items-center"
                    >
                      <span className="text-sm text-ink-400">{when(item.date)}</span>
                      <span>
                        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-gold-600">
                          <SourceIcon item={item} className="size-3.5" />
                          {item.source}
                          <span className="rounded-full bg-cream-100 px-2 py-0.5 tracking-normal normal-case text-ink-500">
                            {kindLabel[item.kind]}
                          </span>
                        </span>
                        <span className="mt-1.5 block font-medium leading-snug text-ink-900 transition group-hover:text-gold-700">
                          {item.title}
                        </span>
                      </span>
                      <span className="hidden size-10 place-items-center rounded-full border border-cream-300 text-ink-500 transition group-hover:border-gold-400 group-hover:text-gold-600 sm:grid">
                        <ArrowUpRight className="size-4" />
                        <span className="sr-only">{linkLabel(item)} (ανοίγει σε νέα καρτέλα)</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink-950 p-8 text-white md:flex-row md:items-center md:p-10">
          <div>
            <p className="font-serif text-2xl">Όλες οι τηλεοπτικές παρουσίες σε ένα κανάλι</p>
            <p className="mt-2 text-white/60">Εγγραφείτε στο επίσημο κανάλι YouTube της Βάσως Πανταζή.</p>
          </div>
          <a href={youtubeChannel} target="_blank" rel="noopener noreferrer" className="btn btn-gold shrink-0">
            <YoutubeIcon className="size-5" /> Κανάλι YouTube
          </a>
        </div>
      </div>
    </section>
  );
}
