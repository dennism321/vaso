"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Lock, LogIn } from "lucide-react";
import { loginAction } from "@/app/actions/admin";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await loginAction(data);
      if (result.ok) {
        router.replace("/admin");
        router.refresh();
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
          Κωδικός πρόσβασης
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            className="field field-dark pl-11"
          />
        </div>
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-gold w-full">
        {pending ? "Σύνδεση…" : "Σύνδεση"} <LogIn className="size-4" />
      </button>
    </form>
  );
}
