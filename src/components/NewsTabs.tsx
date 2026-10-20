import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/news", label: "Άρθρα & οδηγοί" },
  { href: "/media", label: "Στα ΜΜΕ" },
];

/** Switch between the articles page and the media appearances page. */
export default function NewsTabs({ active }: { active: "/news" | "/media" }) {
  return (
    <nav aria-label="Αρθρογραφία & ΜΜΕ" className="mb-10 flex gap-8 border-b border-cream-200">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.href === active ? "page" : undefined}
          className={cn(
            "-mb-px border-b-2 pb-4 font-serif text-xl transition",
            tab.href === active ? "border-gold-500 text-ink-900" : "border-transparent text-ink-400 hover:text-ink-900",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
