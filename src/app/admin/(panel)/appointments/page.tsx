import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { deleteAppointment, updateAppointmentStatus } from "@/app/actions/admin";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { getAppointments } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { consultationLabel, formatBookingDate } from "@/lib/booking";
import { cn, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const tabs = [
  { id: "upcoming", label: "Επερχόμενα" },
  { id: "past", label: "Παρελθόντα" },
  { id: "cancelled", label: "Ακυρωμένα" },
];

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-200 text-slate-700",
  cancelled: "bg-red-100 text-red-700",
};
const statusLabels: Record<string, string> = {
  pending: "Σε αναμονή",
  confirmed: "Επιβεβαιωμένο",
  completed: "Ολοκληρώθηκε",
  cancelled: "Ακυρώθηκε",
};

function StatusButton({ id, status, label, variant = "outline" }: { id: number; status: string; label: string; variant?: "outline" | "dark" }) {
  return (
    <form action={updateAppointmentStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={cn("btn btn-sm", variant === "dark" ? "btn-dark" : "btn-outline")}>
        {label}
      </button>
    </form>
  );
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminAppointmentsPage({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;
  const raw = Array.isArray(sp.scope) ? sp.scope[0] : sp.scope;
  const scope = tabs.some((t) => t.id === raw) ? (raw as string) : "upcoming";
  const appointments = await getAppointments(scope);

  return (
    <div>
      <h1 className="font-serif text-4xl text-ink-900">Ραντεβού</h1>
      <p className="mt-2 text-ink-500">Κρατήσεις από το σύστημα online ραντεβού.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/admin/appointments?scope=${tab.id}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              scope === tab.id ? "bg-ink-900 text-white" : "bg-white text-ink-600 hover:bg-cream-200",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {appointments.length === 0 && (
          <p className="rounded-2xl border border-dashed border-cream-300 bg-white p-10 text-center text-ink-500">
            Δεν υπάρχουν ραντεβού σε αυτή την κατηγορία.
          </p>
        )}
        {appointments.map((a) => (
          <article key={a.id} className="rounded-2xl border border-cream-200 bg-white p-6">
            <div className="flex flex-wrap items-start gap-5">
              <div className="w-20 shrink-0 rounded-2xl bg-ink-950 py-3 text-center text-white">
                <p className="text-2xl font-semibold leading-none">{a.date.slice(8)}</p>
                <p className="mt-1 text-xs text-white/60">{a.date.slice(5, 7)}/{a.date.slice(0, 4)}</p>
                <p className="mt-2 text-sm font-semibold text-gold-300">{a.time}</p>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-ink-900">{a.name}</h2>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", statusStyles[a.status])}>
                    {statusLabels[a.status] ?? a.status}
                  </span>
                  <span className="rounded-full bg-cream-100 px-2.5 py-0.5 font-mono text-xs text-ink-600">{a.reference}</span>
                </div>
                <p className="mt-1 text-sm capitalize text-ink-600">
                  {formatBookingDate(a.date)} · {a.time} · {consultationLabel(a.type)}
                  {a.practiceArea ? ` · ${a.practiceArea}` : ""}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500">
                  <a href={`mailto:${a.email}`} className="flex items-center gap-1.5 hover:text-gold-700">
                    <Mail className="size-3.5" /> {a.email}
                  </a>
                  <a href={`tel:${a.phone}`} className="flex items-center gap-1.5 hover:text-gold-700">
                    <Phone className="size-3.5" /> {a.phone}
                  </a>
                </div>
                {a.notes && <p className="mt-3 whitespace-pre-line rounded-xl bg-cream-50 p-4 text-sm text-ink-600">{a.notes}</p>}
                <p className="mt-3 text-xs text-ink-400">Καταχωρήθηκε: {formatDateTime(a.createdAt)}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-cream-200 pt-4">
              {a.status === "pending" && <StatusButton id={a.id} status="confirmed" label="Επιβεβαίωση" variant="dark" />}
              {a.status !== "completed" && a.status !== "cancelled" && (
                <StatusButton id={a.id} status="completed" label="Ολοκληρώθηκε" />
              )}
              {a.status !== "cancelled" ? (
                <StatusButton id={a.id} status="cancelled" label="Ακύρωση" />
              ) : (
                <StatusButton id={a.id} status="pending" label="Επαναφορά" />
              )}
              <form action={deleteAppointment} className="ml-auto">
                <input type="hidden" name="id" value={a.id} />
                <ConfirmButton message="Οριστική διαγραφή του ραντεβού;" className="text-sm text-red-600 hover:underline">
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
