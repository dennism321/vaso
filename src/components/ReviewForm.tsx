"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { CircleCheck, Send, TriangleAlert } from "lucide-react";
import { submitReview } from "@/app/actions/public";
import type { ActionResult } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState<number | null>(null);
  const [state, setState] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const error = (key: string) => state?.errors?.[key];

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("rating", String(rating));
    startTransition(async () => {
      const result = await submitReview(data);
      setState(result);
      if (result.ok) {
        form.reset();
        setRating(5);
      }
    });
  }

  const shown = hover ?? rating;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="hidden" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <span className="label">Βαθμολογία *</span>
        <div className="flex gap-1" role="radiogroup" aria-label="Βαθμολογία" onMouseLeave={() => setHover(null)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} αστέρια`}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHover(value)}
              className="p-1"
            >
              <svg viewBox="0 0 20 20" className={cn("size-8 transition", value <= shown ? "text-gold-400" : "text-cream-300")} fill="currentColor">
                <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.8l6-.8L10 1.5z" />
              </svg>
            </button>
          ))}
        </div>
        {error("rating") && <p className="mt-1.5 text-xs text-orange-700">{error("rating")}</p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="r-name" className="label">
            Όνομα ή αρχικά *
          </label>
          <input id="r-name" name="name" className="field" placeholder="π.χ. Γ. Παπαδόπουλος" aria-invalid={!!error("name")} />
          {error("name") && <p className="mt-1.5 text-xs text-orange-700">{error("name")}</p>}
        </div>
        <div>
          <label htmlFor="r-role" className="label">
            Ιδιότητα
          </label>
          <input id="r-role" name="role" className="field" placeholder="π.χ. Ιδιώτης, Επιχειρηματίας" />
        </div>
      </div>
      <div>
        <label htmlFor="r-content" className="label">
          Η εμπειρία σας *
        </label>
        <textarea id="r-content" name="content" rows={5} className="field resize-y" aria-invalid={!!error("content")} />
        {error("content") && <p className="mt-1.5 text-xs text-orange-700">{error("content")}</p>}
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-500">
        <input type="checkbox" name="consent" className="mt-0.5 size-4 accent-gold-600" />
        <span>
          Συναινώ στη δημοσίευση της κριτικής μου με το όνομα/αρχικά που δήλωσα, σύμφωνα με την{" "}
          <Link href="/privacy" className="text-gold-700 underline underline-offset-2">
            Πολιτική Απορρήτου
          </Link>
          . *
        </span>
      </label>
      {error("consent") && <p className="-mt-3 text-xs text-orange-700">{error("consent")}</p>}
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
      <button type="submit" disabled={pending} className="btn btn-dark">
        {pending ? "Αποστολή…" : "Υποβολή κριτικής"} <Send className="size-4" />
      </button>
    </form>
  );
}
