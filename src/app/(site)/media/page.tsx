import type { Metadata } from "next";
import MediaBrowser from "@/components/MediaBrowser";
import NewsTabs from "@/components/NewsTabs";
import PageHero from "@/components/PageHero";
import { pressItems } from "@/lib/press";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Στα ΜΜΕ",
  description:
    "Τηλεοπτικές, ραδιοφωνικές και δημοσιογραφικές παρουσίες της ποινικολόγου Βάσως Πανταζή σε υποθέσεις που απασχόλησαν την επικαιρότητα.",
  alternates: { canonical: "/media" },
};

export default function MediaPage() {
  const items = [...pressItems].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero
        eyebrow="Στα ΜΜΕ"
        title="Η Βάσω Πανταζή στα μέσα ενημέρωσης"
        description="Τηλεοπτικές συνεντεύξεις, ραδιοφωνικές εκπομπές και δημοσιεύματα για υποθέσεις που χειρίζεται το γραφείο."
        crumbs={[{ href: "/news", label: "Αρθρογραφία" }, { label: "Στα ΜΜΕ" }]}
      />
      <MediaBrowser items={items} youtubeChannel={site.social.youtube} tabs={<NewsTabs active="/media" />} />
    </>
  );
}
