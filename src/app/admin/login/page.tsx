import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";
import Logo from "@/components/Logo";
import { isAdmin, isAdminConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Σύνδεση διαχείρισης",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  const configured = isAdminConfigured();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-5 py-16">
      <div className="grid-lines absolute inset-0 opacity-60" />
      <div className="absolute left-1/2 top-1/4 size-[36rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[140px]" />
      <div className="relative w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl md:p-10">
          <h1 className="font-serif text-3xl text-white">Διαχείριση ιστότοπου</h1>
          <p className="mt-2 text-sm text-white/50">Συνδεθείτε για να διαχειριστείτε μηνύματα, ραντεβού, κριτικές και άρθρα.</p>
          <div className="mt-8">
            {configured ? (
              <LoginForm />
            ) : (
              <p className="rounded-xl bg-orange-500/10 p-4 text-sm text-orange-200">
                Η διαχείριση δεν είναι ενεργή. Ορίστε τη μεταβλητή περιβάλλοντος <code>ADMIN_PASSWORD</code>.
              </p>
            )}
          </div>
        </div>
        <Link href="/" className="mt-8 flex items-center justify-center gap-2 text-sm text-white/50 transition hover:text-gold-300">
          <ArrowLeft className="size-4" /> Επιστροφή στον ιστότοπο
        </Link>
      </div>
    </main>
  );
}
