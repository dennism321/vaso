"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Check } from "lucide-react";
import { subscribeNewsletter } from "@/lib/forms";
import type { ActionResult } from "@/lib/types";

export default function NewsletterForm() {
  const [state, setState] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      const result = await subscribeNewsletter(data);
      setState(result);
      if (result.ok) form.reset();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <div className="hidden" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex overflow-hidden rounded-full border border-white/15 bg-white/[0.04] focus-within:border-gold-400/70">
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Το email σας"
          className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="m-1 grid size-10 shrink-0 place-items-center rounded-full bg-gold-400 text-ink-950 transition hover:bg-gold-300 disabled:opacity-60"
          aria-label="Εγγραφή"
        >
          {state?.ok ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
        </button>
      </div>
      {state && (
        <p className={state.ok ? "text-xs text-gold-200" : "text-xs text-orange-300"} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
