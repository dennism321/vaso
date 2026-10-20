"use server";

import { randomBytes } from "node:crypto";
import { db } from "@/db";
import { appointments, messages, subscribers, testimonials } from "@/db/schema";
import { isConsultationType, isSlotBookable, isValidISODate, isSlotTime } from "@/lib/booking";
import type { ActionResult, BookingConfirmation } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{6,20}$/;
const GENERIC_ERROR =
  "Παρουσιάστηκε τεχνικό σφάλμα. Δοκιμάστε ξανά ή καλέστε μας στο 210 644 58 95.";

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

function invalid(errors: Record<string, string>): ActionResult<never> {
  return { ok: false, message: "Παρακαλούμε ελέγξτε τα επισημασμένα πεδία.", errors };
}

export async function submitContact(fd: FormData): Promise<ActionResult> {
  if (isBot(fd)) return { ok: true, message: "Ευχαριστούμε! Λάβαμε το μήνυμά σας." };

  const name = field(fd, "name", 160);
  const email = field(fd, "email", 200).toLowerCase();
  const phone = field(fd, "phone", 40);
  const subject = field(fd, "subject", 160);
  const practiceArea = field(fd, "practiceArea", 80);
  const message = field(fd, "message", 5000);
  const urgent = fd.get("urgent") === "on";
  const consent = fd.get("consent") === "on";

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Συμπληρώστε το ονοματεπώνυμό σας.";
  if (!EMAIL_RE.test(email)) errors.email = "Συμπληρώστε ένα έγκυρο email.";
  if (phone && !PHONE_RE.test(phone)) errors.phone = "Ο αριθμός τηλεφώνου δεν είναι έγκυρος.";
  if (message.length < 10) errors.message = "Περιγράψτε σύντομα το θέμα σας (τουλάχιστον 10 χαρακτήρες).";
  if (!consent) errors.consent = "Απαιτείται η συγκατάθεσή σας για την επεξεργασία των στοιχείων.";
  if (Object.keys(errors).length) return invalid(errors);

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
    return {
      ok: true,
      message: urgent
        ? "Λάβαμε το επείγον μήνυμά σας. Για άμεση συνδρομή καλέστε επίσης στο 697 60 99 044."
        : "Ευχαριστούμε! Λάβαμε το μήνυμά σας και θα επικοινωνήσουμε μαζί σας το συντομότερο.",
    };
  } catch (error) {
    console.error("[contact]", error);
    return { ok: false, message: GENERIC_ERROR };
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
  if (isBot(fd)) return { ok: false, message: "Η κράτηση δεν ολοκληρώθηκε." };

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
  if (!isConsultationType(type)) errors.type = "Επιλέξτε τύπο συνάντησης.";
  if (!isValidISODate(date)) errors.date = "Επιλέξτε ημερομηνία.";
  if (!isSlotTime(time)) errors.time = "Επιλέξτε ώρα.";
  if (!errors.date && !errors.time && !isSlotBookable(date, time)) {
    errors.time = "Η ώρα που επιλέξατε δεν είναι πλέον διαθέσιμη. Επιλέξτε άλλη.";
  }
  if (name.length < 2) errors.name = "Συμπληρώστε το ονοματεπώνυμό σας.";
  if (!EMAIL_RE.test(email)) errors.email = "Συμπληρώστε ένα έγκυρο email.";
  if (!PHONE_RE.test(phone)) errors.phone = "Συμπληρώστε έναν έγκυρο αριθμό τηλεφώνου.";
  if (!consent) errors.consent = "Απαιτείται η συγκατάθεσή σας.";
  if (Object.keys(errors).length) return invalid(errors);

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
        message: "Το ραντεβού σας καταχωρήθηκε επιτυχώς.",
        data: { reference, date, time, type, name },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        const detail = String((error as { cause?: { constraint?: string }; constraint?: string })?.cause?.constraint ?? (error as { constraint?: string })?.constraint ?? "");
        if (detail.includes("reference")) continue; // extremely unlikely: retry with a new reference
        return {
          ok: false,
          message: "Η ώρα μόλις κρατήθηκε από άλλον επισκέπτη. Παρακαλούμε επιλέξτε διαφορετική ώρα.",
          errors: { time: "Η ώρα δεν είναι πλέον διαθέσιμη." },
        };
      }
      console.error("[booking]", error);
      return { ok: false, message: GENERIC_ERROR };
    }
  }
  return { ok: false, message: GENERIC_ERROR };
}

export async function submitReview(fd: FormData): Promise<ActionResult> {
  if (isBot(fd)) return { ok: true, message: "Ευχαριστούμε για την κριτική σας!" };

  const name = field(fd, "name", 120);
  const role = field(fd, "role", 120);
  const content = field(fd, "content", 1500);
  const rating = Number(field(fd, "rating", 1));
  const consent = fd.get("consent") === "on";

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Συμπληρώστε το όνομά σας (ή τα αρχικά σας).";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = "Επιλέξτε βαθμολογία.";
  if (content.length < 20) errors.content = "Η κριτική πρέπει να έχει τουλάχιστον 20 χαρακτήρες.";
  if (!consent) errors.consent = "Απαιτείται η συγκατάθεσή σας για τη δημοσίευση.";
  if (Object.keys(errors).length) return invalid(errors);

  try {
    await db.insert(testimonials).values({
      name,
      role: role || null,
      content,
      rating,
      source: "website",
      approved: false,
    });
    return {
      ok: true,
      message: "Ευχαριστούμε θερμά! Η κριτική σας θα δημοσιευθεί μετά από έλεγχο.",
    };
  } catch (error) {
    console.error("[review]", error);
    return { ok: false, message: GENERIC_ERROR };
  }
}

export async function subscribeNewsletter(fd: FormData): Promise<ActionResult> {
  if (isBot(fd)) return { ok: true, message: "Εγγραφήκατε επιτυχώς." };
  const email = field(fd, "email", 200).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Συμπληρώστε ένα έγκυρο email.", errors: { email: "Μη έγκυρο email." } };
  }
  try {
    await db.insert(subscribers).values({ email }).onConflictDoNothing();
    return { ok: true, message: "Ευχαριστούμε! Θα λαμβάνετε τα νέα μας άρθρα στο email σας." };
  } catch (error) {
    console.error("[newsletter]", error);
    return { ok: false, message: GENERIC_ERROR };
  }
}
