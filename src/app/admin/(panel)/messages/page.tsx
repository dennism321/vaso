import Link from "next/link";
import { Archive, Mail, MailOpen, Phone, RotateCcw } from "lucide-react";
import { deleteMessage, updateMessageStatus } from "@/app/actions/admin";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { getMessages } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { cn, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const tabs = [
  { id: "new", label: "Νέα" },
  { id: "read", label: "Αναγνωσμένα" },
  { id: "archived", label: "Αρχείο" },
  { id: "all", label: "Όλα" },
];

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminMessagesPage({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;
  const raw = Array.isArray(sp.status) ? sp.status[0] : sp.status;
  const status = tabs.some((t) => t.id === raw) ? (raw as string) : "new";
  const messages = await getMessages(status);

  return (
    <div>
      <h1 className="font-serif text-4xl text-ink-900">Μηνύματα</h1>
      <p className="mt-2 text-ink-500">Αιτήματα από τη φόρμα επικοινωνίας.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/admin/messages?status=${tab.id}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              status === tab.id ? "bg-ink-900 text-white" : "bg-white text-ink-600 hover:bg-cream-200",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {messages.length === 0 && (
          <p className="rounded-2xl border border-dashed border-cream-300 bg-white p-10 text-center text-ink-500">
            Δεν υπάρχουν μηνύματα σε αυτή την κατηγορία.
          </p>
        )}
        {messages.map((m) => (
          <article
            key={m.id}
            className={cn("rounded-2xl border bg-white p-6", m.status === "new" ? "border-gold-300" : "border-cream-200")}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-ink-900">{m.name}</h2>
                  {m.urgent && <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">Επείγον</span>}
                  {m.practiceArea && <span className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs text-ink-600">{m.practiceArea}</span>}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500">
                  <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 hover:text-gold-700">
                    <Mail className="size-3.5" /> {m.email}
                  </a>
                  {m.phone && (
                    <a href={`tel:${m.phone}`} className="flex items-center gap-1.5 hover:text-gold-700">
                      <Phone className="size-3.5" /> {m.phone}
                    </a>
                  )}
                </div>
              </div>
              <time className="text-xs text-ink-400">{formatDateTime(m.createdAt)}</time>
            </div>
            {m.subject && <p className="mt-4 font-medium text-ink-800">{m.subject}</p>}
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-600">{m.message}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-cream-200 pt-4">
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject ?? "Το αίτημά σας"}`)}`}
                className="btn btn-dark btn-sm"
              >
                Απάντηση
              </a>
              {m.status !== "read" && (
                <form action={updateMessageStatus}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="status" value="read" />
                  <button type="submit" className="btn btn-outline btn-sm">
                    <MailOpen className="size-4" /> Αναγνωσμένο
                  </button>
                </form>
              )}
              {m.status !== "archived" ? (
                <form action={updateMessageStatus}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="status" value="archived" />
                  <button type="submit" className="btn btn-outline btn-sm">
                    <Archive className="size-4" /> Αρχειοθέτηση
                  </button>
                </form>
              ) : (
                <form action={updateMessageStatus}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="status" value="new" />
                  <button type="submit" className="btn btn-outline btn-sm">
                    <RotateCcw className="size-4" /> Επαναφορά
                  </button>
                </form>
              )}
              <form action={deleteMessage} className="ml-auto">
                <input type="hidden" name="id" value={m.id} />
                <ConfirmButton message="Οριστική διαγραφή του μηνύματος;" className="text-sm text-red-600 hover:underline">
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
