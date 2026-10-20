/**
 * Booking rules shared by the client (calendar UI) and the server (validation).
 * All dates are plain "YYYY-MM-DD" strings in Europe/Athens local time.
 */

export const SLOT_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
] as const;

export const BOOKING_WINDOW_DAYS = 45;
export const MIN_LEAD_MINUTES = 120;

export const CONSULTATION_TYPES = [
  {
    id: "office",
    label: "Συνάντηση στο γραφείο",
    short: "Στο γραφείο",
    description: "Προσωπική συνάντηση στο γραφείο μας στην Αθήνα.",
    duration: 60,
  },
  {
    id: "video",
    label: "Βιντεοκλήση",
    short: "Βιντεοκλήση",
    description: "Ασφαλής σύνδεση από οπουδήποτε βρίσκεστε.",
    duration: 45,
  },
  {
    id: "phone",
    label: "Τηλεφωνική συμβουλή",
    short: "Τηλεφωνικά",
    description: "Σας καλούμε εμείς την ώρα που θα επιλέξετε.",
    duration: 30,
  },
] as const;

export type ConsultationType = (typeof CONSULTATION_TYPES)[number]["id"];

export function isConsultationType(value: string): value is ConsultationType {
  return CONSULTATION_TYPES.some((t) => t.id === value);
}

export function consultationLabel(id: string) {
  return CONSULTATION_TYPES.find((t) => t.id === id)?.label ?? id;
}

export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function parseISODate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

export function addDays(value: string, days: number) {
  const date = parseISODate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return toISODate(date);
}

export function isValidISODate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = parseISODate(value);
  return !Number.isNaN(date.getTime()) && toISODate(date) === value;
}

/** Orthodox Easter (Meeus Julian algorithm, converted to the Gregorian calendar). */
export function orthodoxEaster(year: number) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  return toISODate(new Date(Date.UTC(year, month - 1, day + 13)));
}

const holidayCache = new Map<number, Set<string>>();

/** Official Greek public holidays (fixed + Easter based). */
export function greekHolidays(year: number) {
  const cached = holidayCache.get(year);
  if (cached) return cached;
  const easter = orthodoxEaster(year);
  const fixed = ["01-01", "01-06", "03-25", "05-01", "08-15", "10-28", "12-25", "12-26"].map(
    (md) => `${year}-${md}`,
  );
  // Clean Monday, Good Friday, Easter Monday, Whit Monday
  const movable = [-48, -2, 1, 50].map((offset) => addDays(easter, offset));
  const set = new Set([...fixed, ...movable]);
  holidayCache.set(year, set);
  return set;
}

export function isBusinessDay(value: string) {
  const dow = parseISODate(value).getUTCDay();
  if (dow === 0 || dow === 6) return false;
  return !greekHolidays(Number(value.slice(0, 4))).has(value);
}

export type AthensNow = { date: string; minutes: number };

export function athensNow(): AthensNow {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function isSlotTime(time: string) {
  return (SLOT_TIMES as readonly string[]).includes(time);
}

export function isSlotBookable(date: string, time: string, now: AthensNow = athensNow()) {
  if (!isValidISODate(date) || !isSlotTime(time)) return false;
  if (!isBusinessDay(date)) return false;
  if (date < now.date) return false;
  if (date > addDays(now.date, BOOKING_WINDOW_DAYS)) return false;
  if (date === now.date && timeToMinutes(time) < now.minutes + MIN_LEAD_MINUTES) return false;
  return true;
}

export function getBookableDays(now: AthensNow = athensNow()) {
  const days: string[] = [];
  for (let i = 0; i <= BOOKING_WINDOW_DAYS; i++) {
    const day = addDays(now.date, i);
    if (!isBusinessDay(day)) continue;
    if (SLOT_TIMES.some((t) => isSlotBookable(day, t, now))) days.push(day);
  }
  return days;
}

export function formatBookingDate(value: string) {
  return new Intl.DateTimeFormat("el-GR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseISODate(value));
}
