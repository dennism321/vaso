import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarCheck, Clock, Mail } from "lucide-react";
import Markdown from "@/components/Markdown";
import PostCard from "@/components/PostCard";
import { FacebookIcon, LinkedinIcon, XIcon } from "@/components/Icons";
import { getAllPublishedSlugs, getPostBySlug, getRelatedPosts } from "@/lib/data";
import { site } from "@/lib/site";
import { formatDate, readingTime, youtubeId } from "@/lib/utils";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllPublishedSlugs()).map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

function decode(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(decode(slug));
  if (!post) return { title: "Το άρθρο δεν βρέθηκε" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(decode(slug));
  if (!post) notFound();

  const related = await getRelatedPosts(post, 3);
  const video = youtubeId(post.videoUrl);
  const url = `${site.url}/news/${post.slug}`;
  const shareText = encodeURIComponent(post.title);
  const shareUrl = encodeURIComponent(url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: post.coverImage ? `${site.url}${post.coverImage.startsWith("/") ? post.coverImage : ""}` : undefined,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: url,
  };

  return (
    <>
      <article>
        <header className="relative overflow-hidden bg-ink-950 pb-20 pt-36 lg:pt-44">
          {post.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt="" className="absolute inset-0 size-full object-cover opacity-25" />
          )}
          <div className="absolute inset-0 bg-linear-to-b from-ink-950/60 via-ink-950/85 to-ink-950" />
          <div className="noise pointer-events-none absolute inset-0 opacity-[0.05]" />
          <div className="container-x relative max-w-4xl">
            <Link href="/news" className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-gold-300">
              <ArrowLeft className="size-4" /> Όλα τα άρθρα
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/55 animate-fade-up">
              <Link
                href={`/news?category=${encodeURIComponent(post.category)}`}
                className="rounded-full border border-gold-400/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold-200 hover:bg-gold-400/10"
              >
                {post.category}
              </Link>
              <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" /> {readingTime(post.content)}′ ανάγνωση
              </span>
            </div>
            <h1 className="mt-6 animate-fade-up font-serif text-4xl leading-[1.1] text-white [animation-delay:120ms] md:text-6xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-6 max-w-3xl animate-fade-up text-lg leading-relaxed text-white/60 [animation-delay:220ms]">
                {post.excerpt}
              </p>
            )}
          </div>
        </header>

        <div className="container-x max-w-4xl py-16 lg:py-20">
          {video ? (
            <div className="relative -mt-28 mb-14 aspect-video overflow-hidden rounded-3xl bg-ink-900 shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video}`}
                title={post.title}
                className="absolute inset-0 size-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            post.coverImage && (
              <div className="relative -mt-28 mb-14 aspect-[16/8] overflow-hidden rounded-3xl bg-ink-900 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.coverImage} alt="" className="absolute inset-0 size-full object-cover" />
              </div>
            )
          )}

          <div className="grid gap-12 lg:grid-cols-[3.5rem_1fr]">
            <aside className="order-2 lg:order-1">
              <div className="flex gap-3 lg:sticky lg:top-28 lg:flex-col">
                <span className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink-400 lg:block">Κοινοποίηση</span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Κοινοποίηση στο Facebook"
                  className="grid size-11 place-items-center rounded-full border border-cream-300 text-ink-600 transition hover:border-gold-400 hover:text-gold-700"
                >
                  <FacebookIcon className="size-4" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Κοινοποίηση στο X"
                  className="grid size-11 place-items-center rounded-full border border-cream-300 text-ink-600 transition hover:border-gold-400 hover:text-gold-700"
                >
                  <XIcon className="size-4" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Κοινοποίηση στο LinkedIn"
                  className="grid size-11 place-items-center rounded-full border border-cream-300 text-ink-600 transition hover:border-gold-400 hover:text-gold-700"
                >
                  <LinkedinIcon className="size-4" />
                </a>
                <a
                  href={`mailto:?subject=${shareText}&body=${shareUrl}`}
                  aria-label="Αποστολή με email"
                  className="grid size-11 place-items-center rounded-full border border-cream-300 text-ink-600 transition hover:border-gold-400 hover:text-gold-700"
                >
                  <Mail className="size-4" />
                </a>
              </div>
            </aside>
            <div className="order-1 lg:order-2">
              <Markdown content={post.content} />

              <div className="mt-16 flex flex-col gap-6 rounded-3xl bg-ink-950 p-8 text-white sm:flex-row sm:items-center md:p-10">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-gold-200 to-gold-500 font-serif text-xl text-ink-950">
                  ΒΠ
                </span>
                <div className="flex-1">
                  <p className="font-serif text-xl">Χρειάζεστε νομική καθοδήγηση για ανάλογο ζήτημα;</p>
                  <p className="mt-1 text-sm text-white/55">
                    Κάθε υπόθεση έχει τις δικές της ιδιαιτερότητες. Μιλήστε με έναν δικηγόρο μας.
                  </p>
                </div>
                <Link href="/booking" className="btn btn-gold btn-sm shrink-0">
                  <CalendarCheck className="size-4" /> Ραντεβού
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-cream-100 py-20 lg:py-24">
          <div className="container-x">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-serif text-3xl text-ink-900 md:text-4xl">Διαβάστε επίσης</h2>
              <Link href="/news" className="hidden items-center gap-2 text-sm font-semibold text-ink-900 hover:text-gold-700 sm:flex">
                Όλα τα άρθρα <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
