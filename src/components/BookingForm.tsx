"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  MapPin,
  Phone,
  TriangleAlert,
  Video,
} from "lucide-react";
import { createBooking } from "@/lib/forms";
import { formCopy } from "@/lib/i18n";
import { localePath } from "@/lib/paths";
import {
  CONSULTATION_TYPES,
  formatBookingDate,
  getBookableDays,
  isSlotBookable,
  SLOT_TIMES,
  timeToMinutes,
  type ConsultationType,
} from "@/lib/booking";
import { site } from "@/lib/site";
import type { ActionResult, BookingConfirmation, SlotAvailability } from "@/lib/types";
import { cn } from "@/lib/utils";

const typeIcons = { office: MapPin, video: Video, phone: Phone } as const;
const weekdays = ["Δε", "Τρ", "Τε", "Πε", "Πα", "Σα", "Κυ"];
const steps = ["Τύπος συνάντησης", "Ημερομηνία & ώρα", "Στοιχεία"];

function monthCells(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: Array<string | null> = Array.from({ length: offset }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${ym}-${String(d).padStart(2, "0")}`);
  return cells;
}

function monthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Intl.DateTimeFormat("el-GR", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}

function downloadIcs(booking: BookingConfirmation) {
  const duration = CONSULTATION_TYPES.find((t) => t.id === booking.type)?.duration ?? 60;
  const day = booking.date.replaceAll("-", "");
  const start = `${day}T${booking.time.replace(":", "")}00`;
  const endMinutes = timeToMinutes(booking.time) + duration;
  const end = `${day}T${String(Math.floor(endMinutes / 60)).padStart(2, "0")}${String(endMinutes % 60).padStart(2, "0")}00`;
  const stamp = `${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
  const typeLabel = CONSULTATION_TYPES.find((t) => t.id === booking.type)?.label ?? "";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vaso Pantazi Law Office//Booking//EL",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${booking.reference}@vasopantazi.gr`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/Athens:${start}`,
    `DTEND;TZID=Europe/Athens:${end}`,
    `SUMMARY:${typeLabel} – ${site.name}`,
    `LOCATION:${booking.type === "office" ? site.fullAddress.replace(/,/g, "\\,") : typeLabel}`,
    `DESCRIPTION:Κωδικός κράτησης ${booking.reference}. Τηλ. ${site.phone.display}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `rantevou-${booking.reference}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function BookingForm({ areas, locale = "el" }: { areas: string[]; locale?: "el" | "en" }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<ConsultationType>("office");
  const [area, setArea] = useState("");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [slots, setSlots] = useState<SlotAvailability[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [result, setResult] = useState<ActionResult<BookingConfirmation> | null>(null);
  const [pending, startTransition] = useTransition();
  const requestId = useRef(0);

  const bookable = useMemo(() => (step >= 2 ? getBookableDays() : []), [step]);
  const bookableSet = useMemo(() => new Set(bookable), [bookable]);
  const months = useMemo(() => Array.from(new Set(bookable.map((d) => d.slice(0, 7)))), [bookable]);
  const currentMonth = month ?? months[0] ?? null;
  const monthIndex = currentMonth ? months.indexOf(currentMonth) : -1;
  const confirmation = result?.ok ? result.data : undefined;
  const error = (key: string) => result?.errors?.[key];

  async function loadSlots(day: string) {
    const id = ++requestId.current;
    setLoadingSlots(true);
    setSlots(null);
    try {
      // Static site: no shared calendar, so every bookable slot is offered and the office confirms by email.
      const json: { slots: SlotAvailability[] } = {
        slots: SLOT_TIMES.map((time) => ({ time, available: isSlotBookable(day, time) })),
      };
      if (id === requestId.current) setSlots(json.slots);
    } catch {
      if (id === requestId.current) setSlots([]);
    } finally {
      if (id === requestId.current) setLoadingSlots(false);
    }
  }

  function pickDate(day: string) {
    setDate(day);
    setTime(null);
    void loadSlots(day);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !time) return;
    const data = new FormData(event.currentTarget);
    data.set("type", type);
    data.set("practiceArea", area);
    data.set("date", date);
    data.set("time", time);
    startTransition(async () => {
      const res = await createBooking(data);
      setResult(res);
      if (res.ok) {
        setStep(4);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (res.errors?.time || res.errors?.date) {
        setTime(null);
        setStep(2);
        if (date) void loadSlots(date);
      }
    });
  }

  if (step === 4 && confirmation) {
    const typeInfo = CONSULTATION_TYPES.find((t) => t.id === confirmation.type);
    return (
      <div className="rounded-[2rem] border border-cream-200 bg-white p-8 text-center shadow-[0_40px_80px_-50px_rgba(8,14,28,0.5)] md:p-14">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-linear-to-br from-gold-200 to-gold-500 text-ink-950">
          <Check className="size-9" strokeWidth={2.5} />
        </span>
        <h2 className="mt-8 font-serif text-4xl text-ink-900">{formCopy[locale].bookingOkTitle}</h2>
        <p className="mx-auto mt-4 max-w-md text-ink-500">
          {formCopy[locale].bookingOkLead.replace("{name}", confirmation.name.split(" ")[0])}
        </p>
        <div className="mx-auto mt-10 grid max-w-lg gap-px overflow-hidden rounded-2xl border border-cream-200 bg-cream-200 text-left sm:grid-cols-2">
          <div className="bg-cream-50 p-5">
            <p className="label">Κωδικός</p>
            <p className="font-mono text-lg font-semibold tracking-wider text-ink-900">{confirmation.reference}</p>
          </div>
          <div className="bg-cream-50 p-5">
            <p className="label">Τύπος</p>
            <p className="font-medium text-ink-900">{typeInfo?.label}</p>
          </div>
          <div className="bg-cream-50 p-5">
            <p className="label">Ημερομηνία</p>
            <p className="font-medium capitalize text-ink-900">{formatBookingDate(confirmation.date)}</p>
          </div>
          <div className="bg-cream-50 p-5">
            <p className="label">Ώρα</p>
            <p className="font-medium text-ink-900">{confirmation.time}</p>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button type="button" onClick={() => downloadIcs(confirmation)} className="btn btn-gold">
            <Download className="size-4" /> Προσθήκη στο ημερολόγιο
          </button>
          <Link href={localePath(locale, "/")} className="btn btn-outline">
            Επιστροφή στην αρχική
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-cream-200 bg-white shadow-[0_40px_80px_-50px_rgba(8,14,28,0.5)]">
      <ol className="grid grid-cols-3 border-b border-cream-200 bg-cream-50">
        {steps.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <li
              key={label}
              className={cn(
                "flex items-center justify-center gap-3 px-3 py-5 text-xs font-semibold sm:text-sm",
                active ? "text-ink-900" : done ? "text-gold-700" : "text-ink-400",
              )}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border text-xs",
                  active && "border-ink-900 bg-ink-900 text-white",
                  done && "border-gold-500 bg-gold-400 text-ink-950",
                  !active && !done && "border-cream-300",
                )}
              >
                {done ? <Check className="size-3.5" /> : n}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </li>
          );
        })}
      </ol>

      <div className="p-6 md:p-10">
        {result && !result.ok && (
          <div role="alert" className="mb-8 flex items-start gap-3 rounded-2xl bg-orange-50 p-4 text-sm text-orange-800">
            <TriangleAlert className="size-5 shrink-0" /> {result.message}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-serif text-3xl text-ink-900">Πώς θέλετε να συναντηθούμε;</h2>
            <p className="mt-2 text-ink-500">Επιλέξτε τον τρόπο που σας εξυπηρετεί καλύτερα.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3" role="radiogroup" aria-label="Τύπος συνάντησης">
              {CONSULTATION_TYPES.map((option) => {
                const Icon = typeIcons[option.id];
                const selected = type === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setType(option.id)}
                    className={cn(
                      "relative rounded-2xl border p-6 text-left transition",
                      selected
                        ? "border-gold-500 bg-gold-100/60 shadow-[0_0_0_4px_rgba(211,171,98,0.18)]"
                        : "border-cream-200 hover:border-gold-300",
                    )}
                  >
                    {selected && (
                      <span className="absolute right-4 top-4 grid size-6 place-items-center rounded-full bg-gold-500 text-white">
                        <Check className="size-3.5" />
                      </span>
                    )}
                    <Icon className="size-7 text-gold-600" strokeWidth={1.5} />
                    <p className="mt-5 font-semibold text-ink-900">{option.label}</p>
                    <p className="mt-1 text-sm text-ink-500">{option.description}</p>
                    <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-ink-400">
                      <Clock className="size-3.5" /> έως {option.duration} λεπτά
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 max-w-md">
              <label htmlFor="b-area" className="label">
                Τομέας δικαίου (προαιρετικά)
              </label>
              <select id="b-area" value={area} onChange={(e) => setArea(e.target.value)} className="field">
                <option value="">Δεν είμαι σίγουρος/η</option>
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-10 flex justify-end">
              <button type="button" onClick={() => setStep(2)} className="btn btn-dark">
                Συνέχεια <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-serif text-3xl text-ink-900">Επιλέξτε ημερομηνία και ώρα</h2>
            <p className="mt-2 text-ink-500">Δευτέρα έως Παρασκευή, εκτός επίσημων αργιών.</p>
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
              <div>
                {currentMonth ? (
                  <>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setMonth(months[monthIndex - 1] ?? currentMonth)}
                        disabled={monthIndex <= 0}
                        className="grid size-10 place-items-center rounded-full border border-cream-200 text-ink-700 transition hover:border-gold-400 disabled:opacity-30"
                        aria-label="Προηγούμενος μήνας"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <p className="font-serif text-xl capitalize text-ink-900">{monthLabel(currentMonth)}</p>
                      <button
                        type="button"
                        onClick={() => setMonth(months[monthIndex + 1] ?? currentMonth)}
                        disabled={monthIndex >= months.length - 1}
                        className="grid size-10 place-items-center rounded-full border border-cream-200 text-ink-700 transition hover:border-gold-400 disabled:opacity-30"
                        aria-label="Επόμενος μήνας"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                    <div className="mt-6 grid grid-cols-7 gap-1.5 text-center">
                      {weekdays.map((d) => (
                        <span key={d} className="pb-2 text-xs font-semibold uppercase text-ink-400">
                          {d}
                        </span>
                      ))}
                      {monthCells(currentMonth).map((cell, i) => {
                        if (!cell) return <span key={`empty-${i}`} />;
                        const available = bookableSet.has(cell);
                        const selected = cell === date;
                        return (
                          <button
                            key={cell}
                            type="button"
                            disabled={!available}
                            onClick={() => pickDate(cell)}
                            aria-pressed={selected}
                            aria-label={formatBookingDate(cell)}
                            className={cn(
                              "aspect-square rounded-xl text-sm font-medium transition",
                              selected && "bg-ink-900 text-white shadow-lg",
                              !selected && available && "bg-cream-100 text-ink-900 hover:bg-gold-200",
                              !available && "cursor-not-allowed text-ink-400/40",
                            )}
                          >
                            {Number(cell.slice(8))}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-ink-500">Δεν υπάρχουν διαθέσιμες ημερομηνίες αυτή τη στιγμή. Καλέστε μας.</p>
                )}
              </div>

              <div>
                <p className="label">Διαθέσιμες ώρες</p>
                {!date && (
                  <div className="grid h-48 place-items-center rounded-2xl border border-dashed border-cream-300 text-sm text-ink-400">
                    Επιλέξτε πρώτα ημερομηνία
                  </div>
                )}
                {date && (
                  <>
                    <p className="mb-4 font-medium capitalize text-ink-900">{formatBookingDate(date)}</p>
                    {loadingSlots && (
                      <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <span key={i} className="h-12 animate-pulse rounded-xl bg-cream-100" />
                        ))}
                      </div>
                    )}
                    {!loadingSlots && slots && slots.some((s) => s.available) && (
                      <div className="grid grid-cols-3 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setTime(slot.time)}
                            aria-pressed={time === slot.time}
                            className={cn(
                              "h-12 rounded-xl border text-sm font-semibold transition",
                              time === slot.time && "border-ink-900 bg-ink-900 text-white",
                              time !== slot.time && slot.available && "border-cream-200 text-ink-800 hover:border-gold-400",
                              !slot.available && "cursor-not-allowed border-transparent bg-cream-100 text-ink-400/50 line-through",
                            )}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                    {!loadingSlots && slots && !slots.some((s) => s.available) && (
                      <p className="rounded-2xl bg-cream-100 p-5 text-sm text-ink-500">
                        Δεν υπάρχουν ελεύθερες ώρες για αυτή την ημέρα. Επιλέξτε άλλη ημερομηνία.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="mt-10 flex justify-between gap-4">
              <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                <ArrowLeft className="size-4" /> Πίσω
              </button>
              <button type="button" onClick={() => setStep(3)} disabled={!date || !time} className="btn btn-dark">
                Συνέχεια <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && date && time && (
          <form onSubmit={onSubmit} noValidate>
            <div className="hidden" aria-hidden="true">
              <input name="website" tabIndex={-1} autoComplete="off" />
              <input type="hidden" name="locale" value={locale} />
            </div>
            <h2 className="font-serif text-3xl text-ink-900">Τα στοιχεία σας</h2>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-2 rounded-full bg-cream-100 px-4 py-2 text-ink-700">
                <CalendarCheck className="size-4 text-gold-600" />
                <span className="capitalize">{formatBookingDate(date)}</span> · {time}
              </span>
              <span className="rounded-full bg-cream-100 px-4 py-2 text-ink-700">
                {CONSULTATION_TYPES.find((t) => t.id === type)?.label}
              </span>
              {area && <span className="rounded-full bg-cream-100 px-4 py-2 text-ink-700">{area}</span>}
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="b-name" className="label">
                  Ονοματεπώνυμο *
                </label>
                <input id="b-name" name="name" autoComplete="name" className="field" aria-invalid={!!error("name")} />
                {error("name") && <p className="mt-1.5 text-xs text-orange-700">{error("name")}</p>}
              </div>
              <div>
                <label htmlFor="b-email" className="label">
                  Email *
                </label>
                <input id="b-email" name="email" type="email" autoComplete="email" className="field" aria-invalid={!!error("email")} />
                {error("email") && <p className="mt-1.5 text-xs text-orange-700">{error("email")}</p>}
              </div>
              <div>
                <label htmlFor="b-phone" className="label">
                  Τηλέφωνο *
                </label>
                <input id="b-phone" name="phone" type="tel" autoComplete="tel" className="field" aria-invalid={!!error("phone")} />
                {error("phone") && <p className="mt-1.5 text-xs text-orange-700">{error("phone")}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="b-notes" className="label">
                  Σύντομη περιγραφή (προαιρετικά)
                </label>
                <textarea
                  id="b-notes"
                  name="notes"
                  rows={4}
                  className="field resize-y"
                  placeholder="Πείτε μας με λίγα λόγια τι αφορά η υπόθεσή σας."
                />
              </div>
            </div>
            <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-ink-500">
              <input type="checkbox" name="consent" className="mt-0.5 size-4 accent-gold-600" />
              <span>
                Συναινώ στην επεξεργασία των στοιχείων μου για τον προγραμματισμό του ραντεβού, σύμφωνα με την{" "}
                <Link href={localePath(locale, "/privacy")} className="text-gold-700 underline underline-offset-2">
                  Πολιτική Απορρήτου
                </Link>
                . *
              </span>
            </label>
            {error("consent") && <p className="mt-1.5 text-xs text-orange-700">{error("consent")}</p>}
            <div className="mt-10 flex justify-between gap-4">
              <button type="button" onClick={() => setStep(2)} className="btn btn-outline">
                <ArrowLeft className="size-4" /> Πίσω
              </button>
              <button type="submit" disabled={pending} className="btn btn-gold">
                {pending ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Καταχώρηση…
                  </>
                ) : (
                  <>
                    Επιβεβαίωση ραντεβού <Check className="size-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
