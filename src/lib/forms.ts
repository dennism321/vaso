import { consultationLabel, isConsultationType, isSlotBookable, isSlotTime, isValidISODate } from "@/lib/booking";
import { site } from "@/lib/site";
import type { ActionResult, BookingConfirmation } from "@/lib/types";

/**
 * Form handling for the static site (runs in the visitor's browser).
 *
 * Optional form service URL (e.g. Formspree, Getform or Web3Forms).
 * When empty, submitting a form opens the visitor's email app with a
 * pre-filled message to the office email (site.email).
 */
export const FORM_ENDPOINT = "";

type FormKind = "contact" | "booking" | "review" | "newsletter";
type Delivery = "sent" | "mailto";

const SUBJECTS: Record<FormKind, string> = {
  contact: "Μήνυμα από την ιστοσελίδα",
  booking: "Αίτημα ραντεβού",
  review: "Νέα κριτική από την ιστοσελίδα",
  newsletter: "Εγγραφή στο newsletter",
};

const MAILTO_NOTE =
  "Το πρόγραμμα email σας άνοιξε με το μήνυμα έτοιμο — πατήστε «Αποστολή» για να ολοκληρωθεί.";
const GENERIC_ERROR = `Παρουσιάστηκε τεχνικό σφάλμα. Δοκιμάστε ξανά ή καλέστε μας στο ${site.phone.display}.`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{6,20}$/;

function field(fd: FormData, key: string, max = 2000) {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isBot(fd: FormData) {
  return field(fd, "website").length > 0;
}

function invalid(errors: Record<string, string>): ActionResult<never> {
  return { ok: false, message: "Παρακαλούμε ελέγξτε τα επισημασμένα πεδία.", errors };
}

/** Sends the fields to FORM_ENDPOINT, or opens a pre-filled email. Returns how it was sent. */
async function deliver(kind: FormKind, fields: Record<string, string>, subjectExtra = ""): Promise<Delivery> {
  const subject = SUBJECTS[kind] + (subjectExtra ? ` — ${subjectExtra}` : "");
  const filled = Object.fromEntries(Object.entries(fields).filter(([, v]) => v.trim().length > 0));

  if (FORM_ENDPOINT) {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ form: kind, subject, ...filled }),
    });
    if (!res.ok) throw new Error("Submission failed");
    return "sent";
  }

  const body = Object.entries(filled)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return "mailto";
}

/** With the email fallback nothing has reached the office yet, so ask the visitor to press Send. */
function done(sentMessage: string, how: Delivery, extra = "") {
  return how === "mailto" ? [MAILTO_NOTE, extra].filter(Boolean).join(" ") : sentMessage;
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

  const urgentCall = `Για άμεση συνδρομή καλέστε επίσης στο ${site.mobile.display}.`;
  try {
    const how = await deliver(
      "contact",
      {
        "Όνομα": name,
        Email: email,
        "Τηλέφωνο": phone,
        "Τομέας": practiceArea,
        "Θέμα": subject,
        "Επείγον": urgent ? "ΝΑΙ" : "",
        "Μήνυμα": message,
      },
      [urgent ? "ΕΠΕΙΓΟΝ" : "", subject].filter(Boolean).join(" · "),
    );
    const sent = urgent
      ? `Λάβαμε το επείγον μήνυμά σας. ${urgentCall}`
      : "Ευχαριστούμε! Λάβαμε το μήνυμά σας και θα επικοινωνήσουμε μαζί σας το συντομότερο.";
    return { ok: true, message: done(sent, how, urgent ? urgentCall : "") };
  } catch {
    return { ok: false, message: GENERIC_ERROR };
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

  const reference = bookingReference();
  try {
    const how = await deliver(
      "booking",
      {
        "Κωδικός": reference,
        "Τύπος": consultationLabel(type),
        "Ημερομηνία": date,
        "Ώρα": time,
        "Τομέας": practiceArea,
        "Όνομα": name,
        Email: email,
        "Τηλέφωνο": phone,
        "Σημειώσεις": notes,
      },
      `${date} ${time} · ${reference}`,
    );
    return {
      ok: true,
      message: done("Το αίτημα ραντεβού σας στάλθηκε.", how),
      data: { reference, date, time, type, name, via: how },
    };
  } catch {
    return { ok: false, message: GENERIC_ERROR };
  }
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
    const how = await deliver("review", {
      "Όνομα": name,
      "Ιδιότητα": role,
      "Βαθμολογία": `${rating}/5`,
      "Κριτική": content,
    });
    return { ok: true, message: done("Ευχαριστούμε θερμά! Η κριτική σας θα δημοσιευθεί μετά από έλεγχο.", how) };
  } catch {
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
    const how = await deliver("newsletter", { Email: email });
    return { ok: true, message: done("Ευχαριστούμε! Θα λαμβάνετε τα νέα μας άρθρα στο email σας.", how) };
  } catch {
    return { ok: false, message: GENERIC_ERROR };
  }
}
