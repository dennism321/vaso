import PostEditor from "@/components/admin/PostEditor";
import { getPostCategories } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { athensNow } from "@/lib/booking";
import { practiceAreas } from "@/lib/practice-areas";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  await requireAdmin();
  const existing = await getPostCategories();
  const categories = Array.from(new Set([...existing, ...practiceAreas.map((a) => a.category), "Νομικός Οδηγός", "ΜΜΕ"]));

  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl text-ink-900">Νέο άρθρο</h1>
      <PostEditor
        categories={categories}
        post={{
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          category: "Ποινικό Δίκαιο",
          coverImage: "/images/posts/rights.jpg",
          videoUrl: "",
          published: true,
          featured: false,
          publishedAt: athensNow().date,
        }}
      />
    </div>
  );
}
