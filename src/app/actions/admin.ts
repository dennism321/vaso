"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { appointments, messages, posts, subscribers, testimonials } from "@/db/schema";
import {
  createAdminSession,
  destroyAdminSession,
  isAdmin,
  isAdminConfigured,
  verifyAdminPassword,
} from "@/lib/auth";
import type { ActionResult } from "@/lib/types";
import { slugify, youtubeId } from "@/lib/utils";

async function assertAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}

function str(fd: FormData, key: string, max = 20000) {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function id(fd: FormData) {
  const value = Number(str(fd, "id", 12));
  if (!Number.isInteger(value) || value <= 0) throw new Error("Invalid id");
  return value;
}

export async function loginAction(fd: FormData): Promise<ActionResult> {
  if (!isAdminConfigured()) {
    return { ok: false, message: "Ορίστε τη μεταβλητή ADMIN_PASSWORD για να ενεργοποιηθεί η διαχείριση." };
  }
  // Small delay to slow down brute-force attempts.
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (!verifyAdminPassword(str(fd, "password", 200))) {
    return { ok: false, message: "Λάθος κωδικός πρόσβασης." };
  }
  await createAdminSession();
  return { ok: true, message: "Επιτυχής σύνδεση." };
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

const MESSAGE_STATUSES = ["new", "read", "archived"];

export async function updateMessageStatus(fd: FormData) {
  await assertAdmin();
  const status = str(fd, "status", 20);
  if (!MESSAGE_STATUSES.includes(status)) return;
  await db.update(messages).set({ status }).where(eq(messages.id, id(fd)));
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(fd: FormData) {
  await assertAdmin();
  await db.delete(messages).where(eq(messages.id, id(fd)));
  revalidatePath("/admin", "layout");
}

const APPOINTMENT_STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export async function updateAppointmentStatus(fd: FormData) {
  await assertAdmin();
  const status = str(fd, "status", 20);
  if (!APPOINTMENT_STATUSES.includes(status)) return;
  const appointmentId = id(fd);
  if (status !== "cancelled") {
    // Re-activating a cancelled booking must not collide with another active booking.
    const [current] = await db.select().from(appointments).where(eq(appointments.id, appointmentId)).limit(1);
    if (current?.status === "cancelled") {
      const [clash] = await db
        .select({ id: appointments.id })
        .from(appointments)
        .where(
          and(
            eq(appointments.date, current.date),
            eq(appointments.time, current.time),
            ne(appointments.status, "cancelled"),
            ne(appointments.id, appointmentId),
          ),
        )
        .limit(1);
      if (clash) return;
    }
  }
  await db.update(appointments).set({ status }).where(eq(appointments.id, appointmentId));
  revalidatePath("/admin", "layout");
}

export async function deleteAppointment(fd: FormData) {
  await assertAdmin();
  await db.delete(appointments).where(eq(appointments.id, id(fd)));
  revalidatePath("/admin", "layout");
}

export async function setTestimonialApproval(fd: FormData) {
  await assertAdmin();
  const approved = str(fd, "approved", 5) === "true";
  await db.update(testimonials).set({ approved }).where(eq(testimonials.id, id(fd)));
  revalidatePath("/admin", "layout");
  revalidatePath("/reviews");
  revalidatePath("/");
}

export async function deleteTestimonial(fd: FormData) {
  await assertAdmin();
  await db.delete(testimonials).where(eq(testimonials.id, id(fd)));
  revalidatePath("/admin", "layout");
  revalidatePath("/reviews");
}

export async function deleteSubscriber(fd: FormData) {
  await assertAdmin();
  await db.delete(subscribers).where(eq(subscribers.id, id(fd)));
  revalidatePath("/admin", "layout");
}

export async function savePost(fd: FormData): Promise<ActionResult<{ id: number; slug: string }>> {
  await assertAdmin();
  const rawId = Number(str(fd, "id", 12));
  const postId = Number.isInteger(rawId) && rawId > 0 ? rawId : null;
  const title = str(fd, "title", 300);
  const slug = slugify(str(fd, "slug", 200) || title);
  const excerpt = str(fd, "excerpt", 600);
  const content = str(fd, "content", 100000);
  const category = str(fd, "category", 80) || "Νομικός Οδηγός";
  const coverImage = str(fd, "coverImage", 500);
  const videoUrl = str(fd, "videoUrl", 500);
  const published = fd.get("published") === "on";
  const featured = fd.get("featured") === "on";
  const publishedAtRaw = str(fd, "publishedAt", 20);

  const errors: Record<string, string> = {};
  if (title.length < 4) errors.title = "Ο τίτλος είναι υποχρεωτικός.";
  if (!slug) errors.slug = "Το slug είναι υποχρεωτικό.";
  if (content.length < 20) errors.content = "Το περιεχόμενο είναι πολύ σύντομο.";
  if (videoUrl && !youtubeId(videoUrl)) errors.videoUrl = "Μη έγκυρος σύνδεσμος YouTube.";
  if (coverImage && !/^(\/|https?:\/\/)/.test(coverImage)) errors.coverImage = "Χρησιμοποιήστε διαδρομή /images/... ή URL.";
  let publishedAt = new Date();
  if (publishedAtRaw) {
    const parsed = new Date(`${publishedAtRaw}T09:00:00`);
    if (Number.isNaN(parsed.getTime())) errors.publishedAt = "Μη έγκυρη ημερομηνία.";
    else publishedAt = parsed;
  }
  if (Object.keys(errors).length) {
    return { ok: false, message: "Ελέγξτε τα επισημασμένα πεδία.", errors };
  }

  const values = {
    title,
    slug,
    excerpt: excerpt || content.replace(/[#>*_`-]/g, "").slice(0, 220),
    content,
    category,
    coverImage: coverImage || null,
    videoUrl: videoUrl || null,
    published,
    featured,
    publishedAt,
    updatedAt: new Date(),
  };

  try {
    let saved: { id: number; slug: string } | undefined;
    if (postId) {
      [saved] = await db
        .update(posts)
        .set(values)
        .where(eq(posts.id, postId))
        .returning({ id: posts.id, slug: posts.slug });
    } else {
      [saved] = await db.insert(posts).values(values).returning({ id: posts.id, slug: posts.slug });
    }
    if (!saved) return { ok: false, message: "Το άρθρο δεν βρέθηκε." };
    revalidatePath("/news");
    revalidatePath(`/news/${saved.slug}`);
    revalidatePath("/");
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Το άρθρο αποθηκεύτηκε.", data: saved };
  } catch (error) {
    const e = error as { code?: string; cause?: { code?: string } };
    if (e?.code === "23505" || e?.cause?.code === "23505") {
      return { ok: false, message: "Υπάρχει ήδη άρθρο με αυτό το slug.", errors: { slug: "Το slug χρησιμοποιείται ήδη." } };
    }
    console.error("[savePost]", error);
    return { ok: false, message: "Σφάλμα κατά την αποθήκευση." };
  }
}

export async function deletePost(fd: FormData) {
  await assertAdmin();
  await db.delete(posts).where(eq(posts.id, id(fd)));
  revalidatePath("/news");
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}
