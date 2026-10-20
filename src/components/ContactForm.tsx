"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { CircleCheck, Send, TriangleAlert } from "lucide-react";
import { submitContact } from "@/lib/forms";
import type { ActionResult } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ContactForm({ areas, defaultArea = "" }: { areas: string[]; defaultArea?: string }) {
  const [state, setState] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const error = (key: string) => state?.errors?.[key];

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      const result = await submitContact(data);
      setState(result);
      if (result.ok) form.reset();
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="hidden" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">
            Ονοματεπώνυμο *
          </label>
          <input id="c-name" name="name" autoComplete="name" className="field" aria-invalid={!!error("name")} />
          {error("name") && <p className="mt-1.5 text-xs text-orange-700">{error("name")}</p>}
        </div>
        <div>
          <label htmlFor="c-email" className="label">
            Email *
          </label>
          <input id="c-email" name="email" type="email" autoComplete="email" className="field" aria-invalid={!!error("email")} />
          {error("email") && <p className="mt-1.5 text-xs text-orange-700">{error("email")}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-phone" className="label">
            Τηλέφωνο
          </label>
          <input id="c-phone" name="phone" type="tel" autoComplete="tel" className="field" aria-invalid={!!error("phone")} />
          {error("phone") && <p className="mt-1.5 text-xs text-orange-700">{error("phone")}</p>}
        </div>
        <div>
          <label htmlFor="c-area" className="label">
            Τομέας
          </label>
          <select id="c-area" name="practiceArea" defaultValue={defaultArea} className="field">
            <option value="">Επιλέξτε (προαιρετικά)</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
            <option value="Άλλο">Άλλο</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="c-subject" className="label">
          Θέμα
        </label>
        <input id="c-subject" name="subject" className="field" />
      </div>

      <div>
        <label htmlFor="c-message" className="label">
          Μήνυμα *
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={6}
          className="field resize-y"
          placeholder="Περιγράψτε σύντομα την υπόθεσή σας. Μην συμπεριλάβετε ευαίσθητα στοιχεία που δεν είναι απαραίτητα."
          aria-invalid={!!error("message")}
        />
        {error("message") && <p className="mt-1.5 text-xs text-orange-700">{error("message")}</p>}
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gold-300/60 bg-gold-100/50 p-4 text-sm text-ink-700">
        <input type="checkbox" name="urgent" className="mt-0.5 size-4 accent-gold-600" />
        <span>
          <strong className="font-semibold text-ink-900">Επείγουσα υπόθεση</strong> — π.χ. σύλληψη, κλήση σε
          απολογία ή επικείμενη δικάσιμος. Για άμεση συνδρομή καλέστε και στο κινητό.
        </span>
      </label>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-500">
          <input type="checkbox" name="consent" className="mt-0.5 size-4 accent-gold-600" aria-invalid={!!error("consent")} />
          <span>
            Συναινώ στην επεξεργασία των στοιχείων μου για την απάντηση στο αίτημά μου, σύμφωνα με την{" "}
            <Link href="/privacy" className="text-gold-700 underline underline-offset-2">
              Πολιτική Απορρήτου
            </Link>
            . *
          </span>
        </label>
        {error("consent") && <p className="mt-1.5 text-xs text-orange-700">{error("consent")}</p>}
      </div>

      {state && (
        <div
          role="status"
          className={cn(
            "flex items-start gap-3 rounded-2xl p-4 text-sm",
            state.ok ? "bg-emerald-50 text-emerald-800" : "bg-orange-50 text-orange-800",
          )}
        >
          {state.ok ? <CircleCheck className="size-5 shrink-0" /> : <TriangleAlert className="size-5 shrink-0" />}
          {state.message}
        </div>
      )}

      <button type="submit" disabled={pending} className="btn btn-dark w-full sm:w-auto">
        {pending ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Αποστολή…
          </>
        ) : (
          <>
            Αποστολή μηνύματος <Send className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
