import Link from "next/link";
import { ArrowRight, CalendarCheck, Download, Inbox, Mail, Newspaper, Star } from "lucide-react";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteSubscriber } from "@/app/actions/admin";
import { getAdminCounts, getRecentMessages, getSubscribers, getUpcomingAppointments } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { consultationLabel, formatBookingDate } from "@/lib/booking";
import { cn, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

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

export default async function AdminDashboard() {
  await requireAdmin();
  const [counts, messages, appointments, subscribers] = await Promise.all([
    getAdminCounts(),
    getRecentMessages(5),
    getUpcomingAppointments(6),
    getSubscribers(8),
  ]);

  const cards = [
    { label: "Νέα μηνύματα", value: counts.newMessages, icon: Inbox, href: "/admin/messages" },
    { label: "Επερχόμενα ραντεβού", value: counts.upcomingAppointments, icon: CalendarCheck, href: "/admin/appointments" },
    { label: "Κριτικές σε αναμονή", value: counts.pendingReviews, icon: Star, href: "/admin/reviews" },
    { label: "Δημοσιευμένα άρθρα", value: counts.publishedPosts, icon: Newspaper, href: "/admin/posts" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-ink-900">Καλώς ήρθατε</h1>
          <p className="mt-2 text-ink-500">Μια ματιά στη δραστηριότητα του ιστότοπου.</p>
        </div>
        <a
          href="/api/download-source"
          className="btn btn-outline btn-sm"
          title="Λήψη ZIP με τον πηγαίο κώδικα και όλες τις εικόνες"
        >
          <Download className="size-4" /> Λήψη ιστότοπου (ZIP)
        </a>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="group rounded-2xl border border-cream-200 bg-white p-6 transition hover:border-gold-300">
            <div className="flex items-center justify-between">
              <card.icon className="size-5 text-gold-600" />
              <ArrowRight className="size-4 text-ink-400 opacity-0 transition group-hover:opacity-100" />
            </div>
            <p className="mt-6 font-serif text-4xl text-ink-900">{card.value}</p>
            <p className="mt-1 text-sm text-ink-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-cream-200 bg-white">
          <div className="flex items-center justify-between border-b border-cream-200 p-6">
            <h2 className="font-serif text-xl text-ink-900">Επόμενα ραντεβού</h2>
            <Link href="/admin/appointments" className="text-sm font-medium text-gold-700 hover:underline">
              Όλα
            </Link>
          </div>
          {appointments.length === 0 ? (
            <p className="p-6 text-sm text-ink-500">Δεν υπάρχουν επερχόμενα ραντεβού.</p>
          ) : (
            <ul className="divide-y divide-cream-200">
              {appointments.map((a) => (
                <li key={a.id} className="flex items-center gap-4 p-5">
                  <div className="w-16 shrink-0 rounded-xl bg-ink-950 py-2 text-center text-white">
                    <p className="text-lg font-semibold leading-none">{a.date.slice(8)}</p>
                    <p className="mt-1 text-[0.65rem] uppercase text-gold-300">{a.time}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink-900">{a.name}</p>
                    <p className="truncate text-xs capitalize text-ink-500">
                      {formatBookingDate(a.date)} · {consultationLabel(a.type)}
                    </p>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[a.status])}>
                    {statusLabels[a.status] ?? a.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-cream-200 bg-white">
          <div className="flex items-center justify-between border-b border-cream-200 p-6">
            <h2 className="font-serif text-xl text-ink-900">Πρόσφατα μηνύματα</h2>
            <Link href="/admin/messages" className="text-sm font-medium text-gold-700 hover:underline">
              Όλα
            </Link>
          </div>
          {messages.length === 0 ? (
            <p className="p-6 text-sm text-ink-500">Δεν υπάρχουν μηνύματα.</p>
          ) : (
            <ul className="divide-y divide-cream-200">
              {messages.map((m) => (
                <li key={m.id} className="p-5">
                  <div className="flex items-center gap-2">
                    {m.status === "new" && <span className="size-2 rounded-full bg-gold-500" />}
                    <p className="flex-1 truncate font-medium text-ink-900">{m.name}</p>
                    {m.urgent && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Επείγον</span>}
                    <span className="text-xs text-ink-400">{formatDateTime(m.createdAt)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-500">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-cream-200 bg-white">
        <div className="flex items-center justify-between border-b border-cream-200 p-6">
          <h2 className="font-serif text-xl text-ink-900">Συνδρομητές newsletter</h2>
          <span className="rounded-full bg-cream-100 px-3 py-1 text-sm text-ink-600">{counts.subscribers} συνολικά</span>
        </div>
        {subscribers.length === 0 ? (
          <p className="p-6 text-sm text-ink-500">Δεν υπάρχουν ακόμη συνδρομητές.</p>
        ) : (
          <ul className="divide-y divide-cream-200">
            {subscribers.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-6 py-4 text-sm">
                <Mail className="size-4 text-gold-600" />
                <a href={`mailto:${s.email}`} className="flex-1 text-ink-800 hover:underline">
                  {s.email}
                </a>
                <span className="text-xs text-ink-400">{formatDateTime(s.createdAt)}</span>
                <form action={deleteSubscriber}>
                  <input type="hidden" name="id" value={s.id} />
                  <ConfirmButton message="Διαγραφή συνδρομητή;" className="text-xs text-red-600 hover:underline">
                    Διαγραφή
                  </ConfirmButton>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
