import { and, asc, count, desc, eq, gte, lt, ne } from "drizzle-orm";
import { db } from "@/db";
import { appointments, messages, posts, subscribers, testimonials } from "@/db/schema";
import { athensNow } from "@/lib/booking";
import { ensureSeeded } from "@/lib/data";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await ensureSeeded();
    return await fn();
  } catch (error) {
    console.error("[admin-data]", error);
    return fallback;
  }
}

export async function getAdminCounts() {
  return safe(
    async () => {
      const today = athensNow().date;
      const [[newMessages], [pendingAppointments], [pendingReviews], [publishedPosts], [subscriberCount], [upcoming]] =
        await Promise.all([
          db.select({ n: count() }).from(messages).where(eq(messages.status, "new")),
          db
            .select({ n: count() })
            .from(appointments)
            .where(and(eq(appointments.status, "pending"), gte(appointments.date, today))),
          db.select({ n: count() }).from(testimonials).where(eq(testimonials.approved, false)),
          db.select({ n: count() }).from(posts).where(eq(posts.published, true)),
          db.select({ n: count() }).from(subscribers),
          db
            .select({ n: count() })
            .from(appointments)
            .where(and(ne(appointments.status, "cancelled"), gte(appointments.date, today))),
        ]);
      return {
        newMessages: newMessages?.n ?? 0,
        pendingAppointments: pendingAppointments?.n ?? 0,
        pendingReviews: pendingReviews?.n ?? 0,
        publishedPosts: publishedPosts?.n ?? 0,
        subscribers: subscriberCount?.n ?? 0,
        upcomingAppointments: upcoming?.n ?? 0,
      };
    },
    {
      newMessages: 0,
      pendingAppointments: 0,
      pendingReviews: 0,
      publishedPosts: 0,
      subscribers: 0,
      upcomingAppointments: 0,
    },
  );
}

export async function getMessages(status: string) {
  return safe(async () => {
    const query = db.select().from(messages);
    const filtered = status === "all" ? query : query.where(eq(messages.status, status));
    return filtered.orderBy(desc(messages.createdAt)).limit(200);
  }, []);
}

export async function getRecentMessages(limit = 5) {
  return safe(() => db.select().from(messages).orderBy(desc(messages.createdAt)).limit(limit), []);
}

export async function getAppointments(scope: string) {
  return safe(async () => {
    const today = athensNow().date;
    if (scope === "past") {
      return db
        .select()
        .from(appointments)
        .where(and(lt(appointments.date, today), ne(appointments.status, "cancelled")))
        .orderBy(desc(appointments.date), desc(appointments.time))
        .limit(200);
    }
    if (scope === "cancelled") {
      return db
        .select()
        .from(appointments)
        .where(eq(appointments.status, "cancelled"))
        .orderBy(desc(appointments.date), desc(appointments.time))
        .limit(200);
    }
    return db
      .select()
      .from(appointments)
      .where(and(gte(appointments.date, today), ne(appointments.status, "cancelled")))
      .orderBy(asc(appointments.date), asc(appointments.time))
      .limit(200);
  }, []);
}

export async function getUpcomingAppointments(limit = 5) {
  const items = await getAppointments("upcoming");
  return items.slice(0, limit);
}

export async function getTestimonials(scope: string) {
  return safe(
    () =>
      db
        .select()
        .from(testimonials)
        .where(eq(testimonials.approved, scope === "approved"))
        .orderBy(desc(testimonials.createdAt))
        .limit(200),
    [],
  );
}

export async function getAllPosts() {
  return safe(
    () =>
      db
        .select({
          id: posts.id,
          slug: posts.slug,
          title: posts.title,
          category: posts.category,
          published: posts.published,
          featured: posts.featured,
          views: posts.views,
          publishedAt: posts.publishedAt,
          videoUrl: posts.videoUrl,
        })
        .from(posts)
        .orderBy(desc(posts.publishedAt)),
    [],
  );
}

export async function getPostById(id: number) {
  return safe(async () => {
    const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return post ?? null;
  }, null);
}

export async function getSubscribers(limit = 10) {
  return safe(() => db.select().from(subscribers).orderBy(desc(subscribers.createdAt)).limit(limit), []);
}

export async function getPostCategories() {
  return safe(async () => {
    const rows = await db.selectDistinct({ category: posts.category }).from(posts);
    return rows.map((r) => r.category);
  }, []);
}
