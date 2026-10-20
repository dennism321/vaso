import { seedPosts, seedTestimonials } from "@/lib/seed-data";
import { readingTime } from "@/lib/utils";

/**
 * Site content now lives in src/lib/seed-data.ts and is baked into the
 * static build. To add an article or review, edit that file and push.
 */

export type PostInput = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string | null;
  videoUrl?: string | null;
  featured?: boolean;
  publishedAt: Date;
  updatedAt?: Date;
};

export type Post = Required<Omit<PostInput, "coverImage" | "videoUrl">> & {
  id: number;
  coverImage: string | null;
  videoUrl: string | null;
};

export type TestimonialInput = {
  name: string;
  role?: string | null;
  content: string;
  rating: number;
};

export type Testimonial = { id: number; name: string; role: string | null; content: string; rating: number };

export type PostSummary = Pick<
  Post,
  "id" | "slug" | "title" | "excerpt" | "category" | "coverImage" | "videoUrl" | "publishedAt" | "featured"
> & { readingMinutes: number };

const allPosts: Post[] = seedPosts
  .map((p, i) => ({
    ...p,
    id: i + 1,
    coverImage: p.coverImage ?? null,
    videoUrl: p.videoUrl ?? null,
    featured: p.featured ?? false,
    updatedAt: p.updatedAt ?? p.publishedAt,
  }))
  .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

const allTestimonials: Testimonial[] = seedTestimonials.map((t, i) => ({
  ...t,
  id: i + 1,
  role: t.role ?? null,
}));

export function toSummary(post: Post): PostSummary {
  const { id, slug, title, excerpt, category, coverImage, videoUrl, publishedAt, featured } = post;
  return {
    id,
    slug,
    title,
    excerpt,
    category,
    coverImage,
    videoUrl,
    publishedAt,
    featured,
    readingMinutes: readingTime(post.content),
  };
}

export function getAllPostSummaries() {
  return allPosts.map(toSummary);
}

export function getLatestPosts(limit = 3) {
  return allPosts.slice(0, limit).map(toSummary);
}

export function getPostsByCategory(category: string, limit = 3) {
  return allPosts.filter((p) => p.category === category).slice(0, limit).map(toSummary);
}

export function getRelatedPosts(post: Pick<Post, "id" | "category">, limit = 3) {
  const sameCategory = allPosts.filter((p) => p.category === post.category && p.id !== post.id);
  const others = allPosts.filter((p) => p.category !== post.category && p.id !== post.id);
  return [...sameCategory, ...others].slice(0, limit).map(toSummary);
}

export function getPostBySlug(slug: string) {
  return allPosts.find((p) => p.slug === slug) ?? null;
}

export function getCategories() {
  const counts = new Map<string, number>();
  for (const p of allPosts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category, "el"));
}

export function getAllPublishedSlugs() {
  return allPosts.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }));
}

export function getApprovedTestimonials(limit = 50) {
  return allTestimonials.slice(0, limit);
}

export function getTestimonialStats() {
  const total = allTestimonials.length;
  const average = total ? allTestimonials.reduce((s, t) => s + t.rating, 0) / total : 0;
  return { total, average };
}
