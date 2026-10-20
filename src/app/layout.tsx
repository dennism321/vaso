import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/noto-serif-display";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Ποινικολόγος Δικηγόρος στην Αθήνα`,
    template: `%s | ${site.shortName} – Δικηγορικό Γραφείο`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "ποινικολόγος",
    "ποινικολόγος Αθήνα",
    "δικηγόρος Αθήνα",
    "δικηγορικό γραφείο",
    "ποινικό δίκαιο",
    "Βάσω Πανταζή",
    "υπεράσπιση",
    "πολιτική αγωγή",
    "ηλεκτρονικό έγκλημα",
    "οικογενειακό δίκαιο",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "el_GR",
    siteName: site.name,
    title: `${site.name} | Δικηγορικό Γραφείο`,
    description: site.description,
    images: [{ url: "/images/hero.jpg", alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/images/hero.jpg"],
  },
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#080e1c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="el" suppressHydrationWarning>
      <body className="min-h-screen bg-cream-50 font-sans text-ink-800 antialiased">{children}</body>
    </html>
  );
}
