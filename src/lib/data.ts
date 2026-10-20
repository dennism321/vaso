import { normalizeSearch } from "@/lib/utils";
import { seedPosts, seedTestimonials, type PostInput, type TestimonialInput } from "@/lib/seed-data";

/**
 * Content for the static site. Articles and reviews live in src/lib/seed-data.ts;
 * these helpers sort and filter them at build time (no database).
 */

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  videoUrl: string | null;
  published: boolean;
  featured: boolean;
  publishedAt: Date;
  updatedAt: Date;
};

export type Testimonial = {
  id: number;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  createdAt: Date;
};

export type PostSummary = Pick<
  Post,
  "id" | "slug" | "title" | "excerpt" | "category" | "coverImage" | "videoUrl" | "publishedAt" | "featured"
> & { readingMinutes: number };

/** Date shown on the sample reviews. Give each real review its own `createdAt` in seed-data.ts. */
const REVIEWS_DATE = new Date("2026-10-20T12:00:00+03:00");

const allPosts: Post[] = seedPosts
  .map((p: PostInput, i) => ({
    id: i + 1,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    category: p.category,
    publishedAt: p.publishedAt,
    coverImage: p.coverImage ?? null,
    videoUrl: p.videoUrl ?? null,
    published: p.published ?? true,
    featured: p.featured ?? false,
    updatedAt: p.publishedAt,
  }))
  .filter((p) => p.published)
  .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

const allTestimonials: Testimonial[] = seedTestimonials
  .map((t: TestimonialInput, i) => ({
    id: i + 1,
    name: t.name,
    role: t.role ?? null,
    content: t.content,
    rating: t.rating ?? 5,
    createdAt: t.createdAt ?? REVIEWS_DATE,
    approved: t.approved ?? true,
  }))
  .filter((t) => t.approved)
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id - a.id)
  .map(({ approved: _approved, ...t }) => t);

function readingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function summary(p: Post): PostSummary {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    coverImage: p.coverImage,
    videoUrl: p.videoUrl,
    publishedAt: p.publishedAt,
    featured: p.featured,
    readingMinutes: readingMinutes(p.content),
  };
}

export async function getAllPostSummaries() {
  return allPosts.map(summary);
}

/** Every article with accent-free search text, for the articles page search. */
export async function getNewsIndex() {
  return allPosts.map((p) => ({
    ...summary(p),
    searchText: normalizeSearch(`${p.title} ${p.excerpt} ${p.content}`),
  }));
}

export async function getPosts({ perPage = 9 }: { perPage?: number } = {}) {
  return { items: allPosts.slice(0, perPage).map(summary), total: allPosts.length };
}

export async function getLatestPosts(limit = 3) {
  return allPosts.slice(0, limit).map(summary);
}

export async function getPostsByCategory(category: string, limit = 3, excludeId?: number) {
  return allPosts
    .filter((p) => p.category === category && p.id !== excludeId)
    .slice(0, limit)
    .map(summary);
}

export async function getRelatedPosts(post: Pick<Post, "id" | "category">, limit = 3) {
  const sameCategory = await getPostsByCategory(post.category, limit, post.id);
  if (sameCategory.length >= limit) return sameCategory;
  const seen = new Set([post.id, ...sameCategory.map((p) => p.id)]);
  const others = allPosts.filter((p) => !seen.has(p.id)).map(summary);
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getPostBySlug(slug: string) {
  return allPosts.find((p) => p.slug === slug) ?? null;
}

export async function getCategories() {
  const counts = new Map<string, number>();
  for (const p of allPosts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category, "el"));
}

export async function getApprovedTestimonials(limit = 50) {
  return allTestimonials.slice(0, limit);
}

export async function getTestimonialStats() {
  const total = allTestimonials.length;
  const average = total ? allTestimonials.reduce((sum, t) => sum + t.rating, 0) / total : 0;
  return { total, average };
}

export async function getAllPublishedSlugs() {
  return allPosts.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }));
}
