import Link from "next/link";
import { ArrowUpRight, Clock, Play } from "lucide-react";
import type { PostSummary } from "@/lib/data";
import { cn, formatDate } from "@/lib/utils";

export default function PostCard({ post, large = false }: { post: PostSummary; large?: boolean }) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-cream-200 bg-white transition duration-500 hover:-translate-y-1 hover:border-gold-300 hover:shadow-[0_30px_60px_-30px_rgba(8,14,28,0.35)]",
        large && "lg:flex-row",
      )}
    >
      <div className={cn("relative overflow-hidden bg-ink-900", large ? "aspect-[16/10] lg:aspect-auto lg:w-[55%]" : "aspect-[16/10]")}>
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-ink-800 to-ink-950" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-ink-950/50 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-ink-950/75 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold-200 backdrop-blur">
          {post.category}
        </span>
        {post.videoUrl && (
          <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-gold-400 px-3 py-1.5 text-xs font-semibold text-ink-950">
            <Play className="size-3.5 fill-current" /> Βίντεο
          </span>
        )}
      </div>
      <div className={cn("flex flex-1 flex-col p-7", large && "lg:justify-center lg:p-12")}>
        <div className="flex items-center gap-3 text-xs text-ink-400">
          <time dateTime={new Date(post.publishedAt).toISOString()}>{formatDate(post.publishedAt)}</time>
          <span className="size-1 rounded-full bg-gold-400" />
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" /> {post.readingMinutes}′ ανάγνωση
          </span>
        </div>
        <h3
          className={cn(
            "mt-4 font-serif leading-snug text-ink-900 transition group-hover:text-gold-700",
            large ? "text-2xl md:text-4xl" : "text-xl",
          )}
        >
          <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className={cn("mt-3 text-sm leading-relaxed text-ink-500", large ? "line-clamp-4 md:text-base" : "line-clamp-3")}>
          {post.excerpt}
        </p>
        <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-ink-900">
          Διαβάστε περισσότερα
          <ArrowUpRight className="size-4 text-gold-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
