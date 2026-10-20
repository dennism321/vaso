import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FaqList({
  items,
  tone = "light",
}: {
  items: { q: string; a: string }[];
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("divide-y border-y", tone === "dark" ? "divide-white/10 border-white/10" : "divide-cream-200 border-cream-200")}>
      {items.map((item, index) => (
        <details key={item.q} className="group" {...(index === 0 ? { open: true } : {})}>
          <summary className="flex items-start justify-between gap-6 py-6 text-left">
            <span
              className={cn(
                "font-serif text-lg leading-snug transition md:text-xl",
                tone === "dark" ? "text-white group-open:text-gold-200" : "text-ink-900 group-open:text-gold-700",
              )}
            >
              {item.q}
            </span>
            <span
              className={cn(
                "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border transition duration-300 group-open:rotate-45",
                tone === "dark"
                  ? "border-white/20 text-gold-300 group-open:border-gold-400"
                  : "border-cream-300 text-gold-600 group-open:border-gold-400 group-open:bg-gold-400 group-open:text-ink-950",
              )}
            >
              <Plus className="size-4" />
            </span>
          </summary>
          <p className={cn("max-w-3xl pb-7 pr-12 leading-relaxed", tone === "dark" ? "text-white/60" : "text-ink-500")}>
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
