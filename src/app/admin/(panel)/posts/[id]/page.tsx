import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { getPostById, getPostCategories } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { practiceAreas } from "@/lib/practice-areas";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function toDateInput(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default async function EditPostPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) notFound();
  const [post, existing] = await Promise.all([getPostById(postId), getPostCategories()]);
  if (!post) notFound();
  const categories = Array.from(new Set([...existing, ...practiceAreas.map((a) => a.category), "Νομικός Οδηγός", "ΜΜΕ"]));

  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl text-ink-900">Επεξεργασία άρθρου</h1>
      <PostEditor
        key={post.id}
        categories={categories}
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          coverImage: post.coverImage ?? "",
          videoUrl: post.videoUrl ?? "",
          published: post.published,
          featured: post.featured,
          publishedAt: toDateInput(post.publishedAt),
        }}
      />
    </div>
  );
}
