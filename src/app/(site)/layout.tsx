import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import RevealObserver from "@/components/RevealObserver";
import { getUi } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getLocalizedAreas } from "@/lib/practice-areas";
import { site, team } from "@/lib/site";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const t = getUi(locale);
  const areas = getLocalizedAreas(locale);
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
    knowsAbout: areas.map((a) => a.title),
    founder: { "@type": "Person", name: team[0]?.name, jobTitle: team[0]?.role },
    sameAs: [site.social.facebook, site.social.youtube],
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-gold-400 px-5 py-3 text-sm font-semibold text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.skipToContent}
      </a>
      <Header locale={locale} areas={areas.map(({ slug, title, icon, short }) => ({ slug, title, icon, short }))} />
      <main id="main">{children}</main>
      <Footer locale={locale} areas={areas} />
      <FloatingContact locale={locale} />
      <RevealObserver />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
