"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, ExternalLink, Inbox, LayoutDashboard, LogOut, Newspaper, Star } from "lucide-react";
import { logoutAction } from "@/app/actions/admin";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

type Counts = { newMessages: number; pendingAppointments: number; pendingReviews: number };

export default function AdminSidebar({ counts }: { counts: Counts }) {
  const pathname = usePathname();
  const links = [
    { href: "/admin", label: "Πίνακας ελέγχου", icon: LayoutDashboard, badge: 0 },
    { href: "/admin/messages", label: "Μηνύματα", icon: Inbox, badge: counts.newMessages },
    { href: "/admin/appointments", label: "Ραντεβού", icon: CalendarCheck, badge: counts.pendingAppointments },
    { href: "/admin/reviews", label: "Κριτικές", icon: Star, badge: counts.pendingReviews },
    { href: "/admin/posts", label: "Άρθρα", icon: Newspaper, badge: 0 },
  ];
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside className="sticky top-0 z-30 flex flex-col bg-ink-950 text-white lg:h-screen lg:w-72 lg:shrink-0">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 p-5 lg:p-6">
        <Logo compact />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300 lg:hidden">Admin</span>
        <div className="hidden flex-1 lg:block">
          <p className="font-serif text-lg leading-tight">Διαχείριση</p>
          <p className="text-xs text-white/45">Βάσω Ζ. Πανταζή & Συνεργάτες</p>
        </div>
      </div>
      <nav className="no-scrollbar flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:p-4" aria-label="Διαχείριση">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
              isActive(link.href) ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
            )}
          >
            <link.icon className={cn("size-4", isActive(link.href) && "text-gold-300")} />
            <span className="flex-1">{link.label}</span>
            {link.badge > 0 && (
              <span className="grid min-w-6 place-items-center rounded-full bg-gold-400 px-1.5 text-xs font-bold text-ink-950">
                {link.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
      <div className="hidden space-y-1 border-t border-white/10 p-4 lg:block">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white">
          <ExternalLink className="size-4" /> Προβολή ιστότοπου
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white">
            <LogOut className="size-4" /> Αποσύνδεση
          </button>
        </form>
      </div>
    </aside>
  );
}
