import type { Metadata } from "next";
import NewsBrowser from "@/components/NewsBrowser";
import { getAllPostSummaries, getCategories } from "@/lib/data";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Αρθρογραφία & ΜΜΕ",
  description:
    "Νομικοί οδηγοί για τα δικαιώματά σας, αναλύσεις και οι παρεμβάσεις του γραφείου στα μέσα ενημέρωσης.",
  alternates: { canonical: "/news" },
};

export default function NewsPage({ locale }: { locale: Locale }) {
  return <NewsBrowser locale={locale} posts={getAllPostSummaries()} categories={getCategories()} />;
}
