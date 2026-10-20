import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-ink-950 text-white">
      <div className="grid-lines absolute inset-0 opacity-60" />
      <div className="absolute left-1/2 top-1/3 size-[40rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[140px]" />
      <div className="container-x relative py-8">
        <Logo />
      </div>
      <div className="container-x relative flex flex-1 flex-col items-center justify-center pb-24 text-center">
        <p className="font-serif text-[8rem] leading-none text-gold-gradient md:text-[12rem]">404</p>
        <h1 className="mt-4 font-serif text-3xl md:text-5xl">Η σελίδα δεν βρέθηκε</h1>
        <p className="mt-4 max-w-md text-white/55">
          Η σελίδα που αναζητάτε δεν υπάρχει ή έχει μετακινηθεί. Μπορείτε να επιστρέψετε στην αρχική ή να
          επικοινωνήσετε μαζί μας.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn btn-gold">
            <ArrowLeft className="size-4" /> Αρχική σελίδα
          </Link>
          <a href={site.phone.href} className="btn btn-ghost">
            <Phone className="size-4" /> {site.phone.display}
          </a>
        </div>
      </div>
    </main>
  );
}
