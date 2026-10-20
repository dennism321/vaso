import Link from "next/link";
import { Eye, Pencil, Play, Plus } from "lucide-react";
import { deletePost } from "@/app/actions/admin";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { getAllPosts } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  await requireAdmin();
  const posts = await getAllPosts();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-ink-900">Άρθρα</h1>
          <p className="mt-2 text-ink-500">Νομικοί οδηγοί, ειδήσεις και εμφανίσεις στα ΜΜΕ.</p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-gold">
          <Plus className="size-4" /> Νέο άρθρο
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-cream-200 bg-white">
        {posts.length === 0 ? (
          <p className="p-10 text-center text-ink-500">Δεν υπάρχουν άρθρα ακόμη.</p>
        ) : (
          <ul className="divide-y divide-cream-200">
            {posts.map((post) => (
              <li key={post.id} className="flex flex-wrap items-center gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={
                        post.published
                          ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                          : "rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                      }
                    >
                      {post.published ? "Δημοσιευμένο" : "Πρόχειρο"}
                    </span>
                    {post.featured && <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-medium text-gold-700">Προβεβλημένο</span>}
                    {post.videoUrl && (
                      <span className="flex items-center gap-1 rounded-full bg-cream-100 px-2.5 py-0.5 text-xs text-ink-600">
                        <Play className="size-3" /> Βίντεο
                      </span>
                    )}
                  </div>
                  <Link href={`/admin/posts/${post.id}`} className="mt-2 block truncate font-medium text-ink-900 hover:text-gold-700">
                    {post.title}
                  </Link>
                  <p className="mt-1 text-xs text-ink-500">
                    {post.category} · {formatDate(post.publishedAt)} · {post.views} προβολές
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {post.published && (
                    <Link href={`/news/${post.slug}`} target="_blank" className="grid size-9 place-items-center rounded-full border border-cream-200 text-ink-600 hover:border-gold-400" aria-label="Προβολή">
                      <Eye className="size-4" />
                    </Link>
                  )}
                  <Link href={`/admin/posts/${post.id}`} className="grid size-9 place-items-center rounded-full border border-cream-200 text-ink-600 hover:border-gold-400" aria-label="Επεξεργασία">
                    <Pencil className="size-4" />
                  </Link>
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={post.id} />
                    <ConfirmButton message="Οριστική διαγραφή του άρθρου;" className="px-2 text-sm text-red-600 hover:underline">
                      Διαγραφή
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
