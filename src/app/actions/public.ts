"use server";

import { randomBytes } from "node:crypto";
import { db } from "@/db";
import { appointments, messages, subscribers, testimonials } from "@/db/schema";
import { isConsultationType, isSlotBookable, isValidISODate, isSlotTime } from "@/lib/booking";
import { actionCopy, parseLocale } from "@/lib/i18n";
import type { ActionResult, BookingConfirmation } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{6,20}$/;

function field(fd: FormData, key: string, max = 2000) {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isBot(fd: FormData) {
  return field(fd, "website").length > 0;
}

function isUniqueViolation(error: unknown) {
  const e = error as { code?: string; cause?: { code?: string } } | null;
  return e?.code === "23505" || e?.cause?.code === "23505";
}

function copyOf(fd: FormData) {
  return actionCopy[parseLocale(field(fd, "locale"))];
}

function invalid(fd: FormData, errors: Record<string, string>): ActionResult<never> {
  return { ok: false, message: copyOf(fd).checkFields, errors };
}

export async function submitContact(fd: FormData): Promise<ActionResult> {
  const m = copyOf(fd);
  if (isBot(fd)) return { ok: true, message: m.contactBot };

  const name = field(fd, "name", 160);
  const email = field(fd, "email", 200).toLowerCase();
  const phone = field(fd, "phone", 40);
  const subject = field(fd, "subject", 160);
  const practiceArea = field(fd, "practiceArea", 80);
  const message = field(fd, "message", 5000);
  const urgent = fd.get("urgent") === "on";
  const consent = fd.get("consent") === "on";

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = m.nameErr;
  if (!EMAIL_RE.test(email)) errors.email = m.emailErr;
  if (phone && !PHONE_RE.test(phone)) errors.phone = m.phoneErr;
  if (message.length < 10) errors.message = m.messageErr;
  if (!consent) errors.consent = m.consentErr;
  if (Object.keys(errors).length) return invalid(fd, errors);

  try {
    await db.insert(messages).values({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      practiceArea: practiceArea || null,
      message,
      urgent,
    });
    return { ok: true, message: urgent ? m.contactUrgent : m.contactOk };
  } catch (error) {
    console.error("[contact]", error);
    return { ok: false, message: m.generic };
  }
}

function bookingReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  let ref = "VP-";
  for (const byte of bytes) ref += alphabet[byte % alphabet.length];
  return ref;
}

export async function createBooking(fd: FormData): Promise<ActionResult<BookingConfirmation>> {
  const m = copyOf(fd);
  if (isBot(fd)) return { ok: false, message: m.bookingFail };

  const type = field(fd, "type", 20);
  const practiceArea = field(fd, "practiceArea", 80);
  const date = field(fd, "date", 10);
  const time = field(fd, "time", 5);
  const name = field(fd, "name", 160);
  const email = field(fd, "email", 200).toLowerCase();
  const phone = field(fd, "phone", 40);
  const notes = field(fd, "notes", 3000);
  const consent = fd.get("consent") === "on";

  const errors: Record<string, string> = {};
  if (!isConsultationType(type)) errors.type = m.typeErr;
  if (!isValidISODate(date)) errors.date = m.dateErr;
  if (!isSlotTime(time)) errors.time = m.timeErr;
  if (!errors.date && !errors.time && !isSlotBookable(date, time)) {
    errors.time = m.timeGone;
  }
  if (name.length < 2) errors.name = m.nameErr;
  if (!EMAIL_RE.test(email)) errors.email = m.emailErr;
  if (!PHONE_RE.test(phone)) errors.phone = m.phoneRequired;
  if (!consent) errors.consent = m.consentSimple;
  if (Object.keys(errors).length) return invalid(fd, errors);

  for (let attempt = 0; attempt < 3; attempt++) {
    const reference = bookingReference();
    try {
      await db.insert(appointments).values({
        reference,
        name,
        email,
        phone,
        type,
        practiceArea: practiceArea || null,
        date,
        time,
        notes: notes || null,
      });
      return {
        ok: true,
        message: m.bookingOk,
        data: { reference, date, time, type, name },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        const detail = String((error as { cause?: { constraint?: string }; constraint?: string })?.cause?.constraint ?? (error as { constraint?: string })?.constraint ?? "");
        if (detail.includes("reference")) continue;
        return { ok: false, message: m.slotTaken, errors: { time: m.slotGone } };
      }
      console.error("[booking]", error);
      return { ok: false, message: m.generic };
    }
  }
  return { ok: false, message: m.generic };
}

export async function submitReview(fd: FormData): Promise<ActionResult> {
  const m = copyOf(fd);
  if (isBot(fd)) return { ok: true, message: m.reviewBot };

  const name = field(fd, "name", 120);
  const role = field(fd, "role", 120);
  const content = field(fd, "content", 1500);
  const rating = Number(field(fd, "rating", 1));
  const consent = fd.get("consent") === "on";

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = m.reviewName;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = m.reviewRating;
  if (content.length < 20) errors.content = m.reviewContent;
  if (!consent) errors.consent = m.reviewConsent;
  if (Object.keys(errors).length) return invalid(fd, errors);

  try {
    await db.insert(testimonials).values({
      name,
      role: role || null,
      content,
      rating,
      source: "website",
      approved: false,
    });
    return { ok: true, message: m.reviewOk };
  } catch (error) {
    console.error("[review]", error);
    return { ok: false, message: m.generic };
  }
}

export async function subscribeNewsletter(fd: FormData): Promise<ActionResult> {
  const m = copyOf(fd);
  if (isBot(fd)) return { ok: true, message: m.newsBot };
  const email = field(fd, "email", 200).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: m.newsEmail, errors: { email: m.invalidEmail } };
  }
  try {
    await db.insert(subscribers).values({ email }).onConflictDoNothing();
    return { ok: true, message: m.newsOk };
  } catch (error) {
    console.error("[newsletter]", error);
    return { ok: false, message: m.generic };
  }
}
