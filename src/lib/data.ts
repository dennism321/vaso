import { cache } from "react";
import { and, count, desc, eq, ilike, ne, or, sql, avg } from "drizzle-orm";
import { db } from "@/db";
import { posts, siteMeta, testimonials, type Post, type Testimonial } from "@/db/schema";
import { seedPosts, seedTestimonials } from "@/lib/seed-data";
import { escapeLike } from "@/lib/utils";

const SEED_KEY = "initial_seed_v1";
let seedPromise: Promise<void> | null = null;

/** Inserts the starter content exactly once per database (guarded by site_meta). */
export function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = db
      .transaction(async (tx) => {
        const inserted = await tx
          .insert(siteMeta)
          .values({ key: SEED_KEY, value: new Date().toISOString() })
          .onConflictDoNothing()
          .returning({ key: siteMeta.key });
        if (inserted.length === 0) return;
        await tx.insert(posts).values(seedPosts).onConflictDoNothing();
        await tx.insert(testimonials).values(seedTestimonials);
      })
      .catch((error) => {
        seedPromise = null;
        console.error("[seed] failed", error);
      });
  }
  return seedPromise;
}

export type PostSummary = Pick<
  Post,
  "id" | "slug" | "title" | "excerpt" | "category" | "coverImage" | "videoUrl" | "publishedAt" | "featured"
> & { readingMinutes: number };

const summaryColumns = {
  id: posts.id,
  slug: posts.slug,
  title: posts.title,
  excerpt: posts.excerpt,
  category: posts.category,
  coverImage: posts.coverImage,
  videoUrl: posts.videoUrl,
  publishedAt: posts.publishedAt,
  featured: posts.featured,
  readingMinutes: sql<number>`greatest(1, round(array_length(regexp_split_to_array(trim(${posts.content}), '\\s+'), 1) / 200.0))::int`,
};

export async function getPosts({
  q,
  category,
  page = 1,
  perPage = 9,
}: {
  q?: string;
  category?: string;
  page?: number;
  perPage?: number;
}) {
  try {
    await ensureSeeded();
    const conditions = [eq(posts.published, true)];
    if (q) {
      const pattern = `%${escapeLike(q)}%`;
      const search = or(
        ilike(posts.title, pattern),
        ilike(posts.excerpt, pattern),
        ilike(posts.content, pattern),
      );
      if (search) conditions.push(search);
    }
    if (category) conditions.push(eq(posts.category, category));
    const where = and(...conditions);
    const [items, totals] = await Promise.all([
      db
        .select(summaryColumns)
        .from(posts)
        .where(where)
        .orderBy(desc(posts.publishedAt))
        .limit(perPage)
        .offset((Math.max(1, page) - 1) * perPage),
      db.select({ total: count() }).from(posts).where(where),
    ]);
    return { items: items as PostSummary[], total: totals[0]?.total ?? 0 };
  } catch (error) {
    console.error("[data] getPosts", error);
    return { items: [] as PostSummary[], total: 0 };
  }
}

export async function getLatestPosts(limit = 3) {
  const { items } = await getPosts({ perPage: limit });
  return items;
}

export async function getPostsByCategory(category: string, limit = 3, excludeId?: number) {
  try {
    await ensureSeeded();
    const conditions = [eq(posts.published, true), eq(posts.category, category)];
    if (excludeId) conditions.push(ne(posts.id, excludeId));
    const items = await db
      .select(summaryColumns)
      .from(posts)
      .where(and(...conditions))
      .orderBy(desc(posts.publishedAt))
      .limit(limit);
    return items as PostSummary[];
  } catch (error) {
    console.error("[data] getPostsByCategory", error);
    return [] as PostSummary[];
  }
}

export async function getRelatedPosts(post: Pick<Post, "id" | "category">, limit = 3) {
  const sameCategory = await getPostsByCategory(post.category, limit, post.id);
  if (sameCategory.length >= limit) return sameCategory;
  const latest = await getLatestPosts(limit + 1 + sameCategory.length);
  const seen = new Set([post.id, ...sameCategory.map((p) => p.id)]);
  return [...sameCategory, ...latest.filter((p) => !seen.has(p.id))].slice(0, limit);
}

export const getPostBySlug = cache(async (slug: string) => {
  try {
    await ensureSeeded();
    const [post] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.published, true)))
      .limit(1);
    return post ?? null;
  } catch (error) {
    console.error("[data] getPostBySlug", error);
    return null;
  }
});

export async function incrementPostViews(id: number) {
  try {
    await db
      .update(posts)
      .set({ views: sql`${posts.views} + 1` })
      .where(eq(posts.id, id));
  } catch (error) {
    console.error("[data] incrementPostViews", error);
  }
}

export async function getCategories() {
  try {
    await ensureSeeded();
    return await db
      .select({ category: posts.category, count: count() })
      .from(posts)
      .where(eq(posts.published, true))
      .groupBy(posts.category)
      .orderBy(posts.category);
  } catch (error) {
    console.error("[data] getCategories", error);
    return [];
  }
}

export async function getApprovedTestimonials(limit = 50): Promise<Testimonial[]> {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.approved, true))
      .orderBy(desc(testimonials.createdAt), desc(testimonials.id))
      .limit(limit);
  } catch (error) {
    console.error("[data] getApprovedTestimonials", error);
    return [];
  }
}

export async function getTestimonialStats() {
  try {
    await ensureSeeded();
    const [row] = await db
      .select({ total: count(), average: avg(testimonials.rating) })
      .from(testimonials)
      .where(eq(testimonials.approved, true));
    return { total: row?.total ?? 0, average: row?.average ? Number(row.average) : 0 };
  } catch (error) {
    console.error("[data] getTestimonialStats", error);
    return { total: 0, average: 0 };
  }
}

export async function getAllPublishedSlugs() {
  try {
    await ensureSeeded();
    return await db
      .select({ slug: posts.slug, updatedAt: posts.updatedAt })
      .from(posts)
      .where(eq(posts.published, true));
  } catch {
    return [];
  }
}
