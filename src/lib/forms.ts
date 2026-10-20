import { consultationLabel, isConsultationType, isSlotBookable, isSlotTime, isValidISODate } from "@/lib/booking";
import { actionCopy, parseLocale, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import type { ActionResult, BookingConfirmation } from "@/lib/types";

/**
 * Form handling for the static site.
 *
 * Optional form backend (e.g. a Formspree / Getform / Web3Forms URL).
 * When left empty, submitting a form opens the visitor's email app with a
 * pre-filled message to the office email (site.email).
 */
export const FORM_ENDPOINT = "";

type FormKind = "contact" | "booking" | "review" | "newsletter";

const SUBJECTS: Record<Locale, Record<FormKind, string>> = {
  el: {
    contact: "Μήνυμα από την ιστοσελίδα",
    booking: "Αίτημα ραντεβού",
    review: "Νέα κριτική από την ιστοσελίδα",
    newsletter: "Εγγραφή στο newsletter",
  },
  en: {
    contact: "Message from the website",
    booking: "Appointment request",
    review: "New review from the website",
    newsletter: "Newsletter sign-up",
  },
};

const MAILTO_NOTE: Record<Locale, string> = {
  el: "Το πρόγραμμα email σας άνοιξε με το μήνυμα έτοιμο — πατήστε «Αποστολή» για να ολοκληρωθεί.",
  en: "Your email app has opened with the message ready — press Send to complete it.",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{6,20}$/;

function field(fd: FormData, key: string, max = 2000) {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isBot(fd: FormData) {
  return field(fd, "website").length > 0;
}

function localeOf(fd: FormData) {
  return parseLocale(field(fd, "locale"));
}

function invalid(fd: FormData, errors: Record<string, string>): ActionResult<never> {
  return { ok: false, message: actionCopy[localeOf(fd)].checkFields, errors };
}

/** Sends the fields to FORM_ENDPOINT, or opens a pre-filled email. Returns how it was sent. */
async function deliver(kind: FormKind, locale: Locale, fields: Record<string, string>, subjectExtra = "") {
  const subject = SUBJECTS[locale][kind] + (subjectExtra ? ` — ${subjectExtra}` : "");
  const clean = Object.fromEntries(Object.entries(fields).filter(([, v]) => v && v.trim().length > 0));

  if (FORM_ENDPOINT) {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ form: kind, subject, ...clean }),
    });
    if (!res.ok) throw new Error("Submission failed");
    return "sent" as const;
  }

  const body = Object.entries(clean)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return "mailto" as const;
}

/** With the mailto fallback nothing has been received yet, so only tell the visitor to press Send. */
function withNote(message: string, how: "sent" | "mailto", locale: Locale, extra = "") {
  return how === "mailto" ? [MAILTO_NOTE[locale], extra].filter(Boolean).join(" ") : message;
}

const URGENT_CALL: Record<Locale, string> = {
  el: `Για άμεση συνδρομή καλέστε επίσης στο ${site.mobile.display}.`,
  en: `For immediate help, also call ${site.mobile.display}.`,
};

export async function submitContact(fd: FormData): Promise<ActionResult> {
  const locale = localeOf(fd);
  const m = actionCopy[locale];
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

  const en = locale === "en";
  try {
    const how = await deliver(
      "contact",
      locale,
      {
        [en ? "Name" : "Όνομα"]: name,
        Email: email,
        [en ? "Phone" : "Τηλέφωνο"]: phone,
        [en ? "Practice area" : "Τομέας"]: practiceArea,
        [en ? "Subject" : "Θέμα"]: subject,
        [en ? "Urgent" : "Επείγον"]: urgent ? (en ? "YES" : "ΝΑΙ") : "",
        [en ? "Message" : "Μήνυμα"]: message,
      },
      [urgent ? (en ? "URGENT" : "ΕΠΕΙΓΟΝ") : "", subject].filter(Boolean).join(" · "),
    );
    return { ok: true, message: withNote(urgent ? m.contactUrgent : m.contactOk, how, locale, urgent ? URGENT_CALL[locale] : "") };
  } catch {
    return { ok: false, message: m.generic };
  }
}

function bookingReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let ref = "VP-";
  for (const byte of bytes) ref += alphabet[byte % alphabet.length];
  return ref;
}

export async function createBooking(fd: FormData): Promise<ActionResult<BookingConfirmation>> {
  const locale = localeOf(fd);
  const m = actionCopy[locale];
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
  if (!errors.date && !errors.time && !isSlotBookable(date, time)) errors.time = m.timeGone;
  if (name.length < 2) errors.name = m.nameErr;
  if (!EMAIL_RE.test(email)) errors.email = m.emailErr;
  if (!PHONE_RE.test(phone)) errors.phone = m.phoneRequired;
  if (!consent) errors.consent = m.consentSimple;
  if (Object.keys(errors).length) return invalid(fd, errors);

  const reference = bookingReference();
  const en = locale === "en";
  try {
    const how = await deliver(
      "booking",
      locale,
      {
        [en ? "Reference" : "Κωδικός"]: reference,
        [en ? "Meeting type" : "Τύπος"]: consultationLabel(type),
        [en ? "Date" : "Ημερομηνία"]: date,
        [en ? "Time" : "Ώρα"]: time,
        [en ? "Practice area" : "Τομέας"]: practiceArea,
        [en ? "Name" : "Όνομα"]: name,
        Email: email,
        [en ? "Phone" : "Τηλέφωνο"]: phone,
        [en ? "Notes" : "Σημειώσεις"]: notes,
      },
      `${date} ${time} · ${reference}`,
    );
    return {
      ok: true,
      message: withNote(m.bookingOk, how, locale),
      data: { reference, date, time, type, name, via: how },
    };
  } catch {
    return { ok: false, message: m.generic };
  }
}

export async function submitReview(fd: FormData): Promise<ActionResult> {
  const locale = localeOf(fd);
  const m = actionCopy[locale];
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

  const en = locale === "en";
  try {
    const how = await deliver("review", locale, {
      [en ? "Name" : "Όνομα"]: name,
      [en ? "Role" : "Ιδιότητα"]: role,
      [en ? "Rating" : "Βαθμολογία"]: `${rating}/5`,
      [en ? "Review" : "Κριτική"]: content,
    });
    return { ok: true, message: withNote(m.reviewOk, how, locale) };
  } catch {
    return { ok: false, message: m.generic };
  }
}

export async function subscribeNewsletter(fd: FormData): Promise<ActionResult> {
  const locale = localeOf(fd);
  const m = actionCopy[locale];
  if (isBot(fd)) return { ok: true, message: m.newsBot };
  const email = field(fd, "email", 200).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: m.newsEmail, errors: { email: m.invalidEmail } };
  }
  try {
    const how = await deliver("newsletter", locale, { Email: email });
    return { ok: true, message: withNote(m.newsOk, how, locale) };
  } catch {
    return { ok: false, message: m.generic };
  }
}
