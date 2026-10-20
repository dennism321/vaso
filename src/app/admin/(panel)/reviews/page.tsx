import Link from "next/link";
import { deleteTestimonial, setTestimonialApproval } from "@/app/actions/admin";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { Stars } from "@/components/Icons";
import { getTestimonials } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { cn, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const tabs = [
  { id: "pending", label: "Σε αναμονή" },
  { id: "approved", label: "Δημοσιευμένες" },
];

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminReviewsPage({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;
  const raw = Array.isArray(sp.scope) ? sp.scope[0] : sp.scope;
  const scope = raw === "approved" ? "approved" : "pending";
  const reviews = await getTestimonials(scope);

  return (
    <div>
      <h1 className="font-serif text-4xl text-ink-900">Κριτικές</h1>
      <p className="mt-2 text-ink-500">Εγκρίνετε τις κριτικές πριν εμφανιστούν στον ιστότοπο.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/admin/reviews?scope=${tab.id}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              scope === tab.id ? "bg-ink-900 text-white" : "bg-white text-ink-600 hover:bg-cream-200",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {reviews.length === 0 && (
          <p className="rounded-2xl border border-dashed border-cream-300 bg-white p-10 text-center text-ink-500 md:col-span-2">
            Δεν υπάρχουν κριτικές σε αυτή την κατηγορία.
          </p>
        )}
        {reviews.map((r) => (
          <article key={r.id} className="flex flex-col rounded-2xl border border-cream-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <Stars rating={r.rating} className="text-ink-900" />
              <time className="text-xs text-ink-400">{formatDateTime(r.createdAt)}</time>
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">«{r.content}»</p>
            <p className="mt-4 text-sm font-semibold text-ink-900">
              {r.name}
              {r.role && <span className="font-normal text-ink-500"> · {r.role}</span>}
            </p>
            <div className="mt-5 flex items-center gap-2 border-t border-cream-200 pt-4">
              <form action={setTestimonialApproval}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="approved" value={r.approved ? "false" : "true"} />
                <button type="submit" className={cn("btn btn-sm", r.approved ? "btn-outline" : "btn-dark")}>
                  {r.approved ? "Απόσυρση" : "Έγκριση & δημοσίευση"}
                </button>
              </form>
              <form action={deleteTestimonial} className="ml-auto">
                <input type="hidden" name="id" value={r.id} />
                <ConfirmButton message="Οριστική διαγραφή της κριτικής;" className="text-sm text-red-600 hover:underline">
                  Διαγραφή
                </ConfirmButton>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
