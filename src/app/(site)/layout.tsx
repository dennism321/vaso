import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageSwitcherRoot } from "@/components/LanguageSwitcher";
import FloatingContact from "@/components/FloatingContact";
import RevealObserver from "@/components/RevealObserver";
import { practiceAreas } from "@/lib/practice-areas";
import { site, team } from "@/lib/site";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}/images/hero.jpg`,
    telephone: "+302106445895",
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode.replace(/\s/g, ""),
      addressCountry: site.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    areaServed: { "@type": "Country", name: "Greece" },
    knowsAbout: practiceAreas.map((a) => a.title),
    founder: { "@type": "Person", name: team[0]?.name, jobTitle: "Δικηγόρος παρ’ Αρείω Πάγω" },
    sameAs: [site.social.facebook, site.social.youtube],
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-gold-400 px-5 py-3 text-sm font-semibold text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Μετάβαση στο περιεχόμενο
      </a>
      <Header areas={practiceAreas.map(({ slug, title, icon, short }) => ({ slug, title, icon, short }))} />
      <main id="main">{children}</main>
      <Footer />
      <FloatingContact />
      <RevealObserver />
      <LanguageSwitcherRoot />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
