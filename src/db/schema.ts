import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

/** Articles, legal guides and media appearances (blog / news). */
export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    content: text("content").notNull().default(""),
    category: varchar("category", { length: 80 }).notNull().default("Νομικός Οδηγός"),
    coverImage: text("cover_image"),
    videoUrl: text("video_url"),
    published: boolean("published").notNull().default(true),
    featured: boolean("featured").notNull().default(false),
    views: integer("views").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("posts_published_idx").on(t.published, t.publishedAt)],
);

/** Contact form submissions. */
export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 200 }).notNull(),
    phone: varchar("phone", { length: 40 }),
    subject: varchar("subject", { length: 160 }),
    practiceArea: varchar("practice_area", { length: 80 }),
    message: text("message").notNull(),
    urgent: boolean("urgent").notNull().default(false),
    status: varchar("status", { length: 20 }).notNull().default("new"), // new | read | archived
    createdAt: createdAt(),
  },
  (t) => [index("messages_status_idx").on(t.status, t.createdAt)],
);

/** Online consultation bookings. A partial unique index prevents double booking. */
export const appointments = pgTable(
  "appointments",
  {
    id: serial("id").primaryKey(),
    reference: varchar("reference", { length: 16 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 200 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull(),
    type: varchar("type", { length: 20 }).notNull(), // office | video | phone
    practiceArea: varchar("practice_area", { length: 80 }),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD (Europe/Athens)
    time: varchar("time", { length: 5 }).notNull(), // HH:MM
    notes: text("notes"),
    status: varchar("status", { length: 20 }).notNull().default("pending"), // pending | confirmed | completed | cancelled
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("appointments_active_slot_idx")
      .on(t.date, t.time)
      .where(sql`status <> 'cancelled'`),
    index("appointments_date_idx").on(t.date),
  ],
);

/** Client reviews – submitted from the site, published after moderation. */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  role: varchar("role", { length: 120 }),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  source: varchar("source", { length: 40 }).notNull().default("website"),
  approved: boolean("approved").notNull().default(false),
  createdAt: createdAt(),
});

/** Newsletter subscribers. */
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  createdAt: createdAt(),
});

/** Small key/value store (used to run the initial content seed only once). */
export const siteMeta = pgTable("site_meta", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: text("value").notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
export type Subscriber = typeof subscribers.$inferSelect;
