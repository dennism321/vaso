"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Stars } from "@/components/Icons";
import { initials } from "@/lib/utils";

type Item = { id: number; name: string; role: string | null; content: string; rating: number };

export default function TestimonialsCarousel({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const scroll = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : track.clientWidth;
    const maxScroll = track.scrollWidth - track.clientWidth - 8;
    if (direction === 1 && track.scrollLeft >= maxScroll) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction === -1 && track.scrollLeft <= 8) {
      track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    } else {
      track.scrollBy({ left: direction * step, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => scroll(1), 6500);
    return () => window.clearInterval(timer);
  }, [paused, items.length, scroll]);

  if (items.length === 0) return null;

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div ref={trackRef} className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-2">
        {items.map((item) => (
          <figure
            key={item.id}
            data-card
            className="relative flex w-[88%] shrink-0 snap-start flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur transition hover:border-gold-400/40 sm:w-[62%] lg:w-[calc((100%-3rem)/3)]"
          >
            <Quote className="size-9 text-gold-400/40" strokeWidth={1.2} />
            <Stars rating={item.rating} className="mt-6 text-white" />
            <blockquote className="mt-5 flex-1 font-serif text-xl leading-relaxed text-white/90">«{item.content}»</blockquote>
            <figcaption className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
              <span className="grid size-11 place-items-center rounded-full bg-linear-to-br from-gold-300 to-gold-600 font-serif text-sm text-ink-950">
                {initials(item.name) || "•"}
              </span>
              <span>
                <span className="block font-medium text-white">{item.name}</span>
                {item.role && <span className="block text-sm text-white/45">{item.role}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      {items.length > 1 && (
        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Προηγούμενη κριτική"
            className="grid size-12 place-items-center rounded-full border border-white/15 text-white transition hover:border-gold-400 hover:text-gold-300"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Επόμενη κριτική"
            className="grid size-12 place-items-center rounded-full border border-white/15 text-white transition hover:border-gold-400 hover:text-gold-300"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
