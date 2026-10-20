import type { Metadata } from "next";
import NewsBrowser from "@/components/NewsBrowser";
import { getCategories, getNewsIndex } from "@/lib/data";

export const metadata: Metadata = {
  title: "Αρθρογραφία & ΜΜΕ",
  description:
    "Νομικοί οδηγοί για τα δικαιώματά σας, αναλύσεις και οι παρεμβάσεις του γραφείου στα μέσα ενημέρωσης.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const [posts, categories] = await Promise.all([getNewsIndex(), getCategories()]);
  return <NewsBrowser posts={posts} categories={categories} />;
}
