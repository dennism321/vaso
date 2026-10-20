"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CircleCheck, Eye, Pencil, Save, TriangleAlert } from "lucide-react";
import { savePost } from "@/app/actions/admin";
import type { ActionResult } from "@/lib/types";
import { cn, slugify } from "@/lib/utils";

export type EditablePost = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  videoUrl: string;
  published: boolean;
  featured: boolean;
  publishedAt: string;
};

const coverOptions = [
  "/images/posts/rights.jpg",
  "/images/posts/detention.jpg",
  "/images/posts/family.jpg",
  "/images/posts/cyber.jpg",
  "/images/posts/courtroom.jpg",
  "/images/courthouse.jpg",
  "/images/office.jpg",
  "/images/consultation.jpg",
  "/images/hero.jpg",
];

export default function PostEditor({ post, categories }: { post: EditablePost; categories: string[] }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(post.id));
  const [content, setContent] = useState(post.content);
  const [cover, setCover] = useState(post.coverImage);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [state, setState] = useState<ActionResult<{ id: number; slug: string }> | null>(null);
  const [pending, startTransition] = useTransition();
  const error = (key: string) => state?.errors?.[key];

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.set("content", content);
    startTransition(async () => {
      const result = await savePost(data);
      setState(result);
      if (result.ok && result.data) {
        setSlug(result.data.slug);
        if (!post.id) router.replace(`/admin/posts/${result.data.id}`);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {post.id && <input type="hidden" name="id" value={post.id} />}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/posts" className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900">
          <ArrowLeft className="size-4" /> Όλα τα άρθρα
        </Link>
        <div className="flex items-center gap-3">
          {post.id && state?.ok !== false && (
            <Link href={`/news/${slug}`} target="_blank" className="btn btn-outline btn-sm">
              <Eye className="size-4" /> Προβολή
            </Link>
          )}
          <button type="submit" disabled={pending} className="btn btn-gold btn-sm">
            <Save className="size-4" /> {pending ? "Αποθήκευση…" : "Αποθήκευση"}
          </button>
        </div>
      </div>

      {state && (
        <div
          role="status"
          className={cn(
            "flex items-start gap-3 rounded-2xl p-4 text-sm",
            state.ok ? "bg-emerald-50 text-emerald-800" : "bg-orange-50 text-orange-800",
          )}
        >
          {state.ok ? <CircleCheck className="size-5 shrink-0" /> : <TriangleAlert className="size-5 shrink-0" />}
          {state.message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="space-y-5 rounded-2xl border border-cream-200 bg-white p-6">
          <div>
            <label htmlFor="title" className="label">
              Τίτλος *
            </label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              className="field text-lg font-medium"
              aria-invalid={!!error("title")}
            />
            {error("title") && <p className="mt-1.5 text-xs text-orange-700">{error("title")}</p>}
          </div>
          <div>
            <label htmlFor="slug" className="label">
              Slug (διεύθυνση URL)
            </label>
            <div className="flex items-center rounded-[0.9rem] border border-cream-300 bg-cream-50 pl-4 text-sm text-ink-400 focus-within:border-gold-500">
              /news/
              <input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                className="min-w-0 flex-1 bg-transparent py-3 pr-4 text-ink-900 focus:outline-none"
              />
            </div>
            {error("slug") && <p className="mt-1.5 text-xs text-orange-700">{error("slug")}</p>}
          </div>
          <div>
            <label htmlFor="excerpt" className="label">
              Περίληψη
            </label>
            <textarea id="excerpt" name="excerpt" defaultValue={post.excerpt} rows={3} className="field resize-y" />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="label mb-0">Περιεχόμενο (Markdown) *</span>
              <div className="flex rounded-full bg-cream-100 p-1 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setTab("write")}
                  className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5", tab === "write" ? "bg-white shadow-sm" : "text-ink-500")}
                >
                  <Pencil className="size-3.5" /> Επεξεργασία
                </button>
                <button
                  type="button"
                  onClick={() => setTab("preview")}
                  className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5", tab === "preview" ? "bg-white shadow-sm" : "text-ink-500")}
                >
                  <Eye className="size-3.5" /> Προεπισκόπηση
                </button>
              </div>
            </div>
            {tab === "write" ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={22}
                className="field resize-y font-mono text-sm leading-relaxed"
                placeholder={"## Υπότιτλος\n\nΚείμενο παραγράφου...\n\n- Λίστα\n- Λίστα\n\n> Παράθεμα"}
                aria-invalid={!!error("content")}
              />
            ) : (
              <div className="article-body min-h-[30rem] rounded-[0.9rem] border border-cream-300 p-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "*Δεν υπάρχει περιεχόμενο.*"}</ReactMarkdown>
              </div>
            )}
            {error("content") && <p className="mt-1.5 text-xs text-orange-700">{error("content")}</p>}
            <p className="mt-2 text-xs text-ink-400">
              Υποστηρίζονται: ## επικεφαλίδες, **έντονα**, *πλάγια*, λίστες, &gt; παραθέματα, [σύνδεσμοι](https://…) και πίνακες.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-4 rounded-2xl border border-cream-200 bg-white p-6">
            <label className="flex items-center justify-between gap-3 text-sm font-medium text-ink-800">
              Δημοσιευμένο
              <input type="checkbox" name="published" defaultChecked={post.published} className="size-5 accent-gold-600" />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm font-medium text-ink-800">
              Προβεβλημένο
              <input type="checkbox" name="featured" defaultChecked={post.featured} className="size-5 accent-gold-600" />
            </label>
            <div>
              <label htmlFor="publishedAt" className="label">
                Ημερομηνία δημοσίευσης
              </label>
              <input id="publishedAt" name="publishedAt" type="date" defaultValue={post.publishedAt} className="field" />
              {error("publishedAt") && <p className="mt-1.5 text-xs text-orange-700">{error("publishedAt")}</p>}
            </div>
            <div>
              <label htmlFor="category" className="label">
                Κατηγορία
              </label>
              <input id="category" name="category" list="category-options" defaultValue={post.category} className="field" />
              <datalist id="category-options">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-cream-200 bg-white p-6">
            <div>
              <label htmlFor="coverImage" className="label">
                Εικόνα εξωφύλλου
              </label>
              <input
                id="coverImage"
                name="coverImage"
                list="cover-options"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                className="field text-sm"
                placeholder="/images/... ή https://..."
              />
              <datalist id="cover-options">
                {coverOptions.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              {error("coverImage") && <p className="mt-1.5 text-xs text-orange-700">{error("coverImage")}</p>}
            </div>
            {cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="" className="aspect-[16/10] w-full rounded-xl object-cover" />
            )}
            <div className="grid grid-cols-3 gap-2">
              {coverOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCover(c)}
                  className={cn("overflow-hidden rounded-lg border-2", cover === c ? "border-gold-500" : "border-transparent")}
                  aria-label={`Επιλογή εικόνας ${c}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-cream-200 bg-white p-6">
            <label htmlFor="videoUrl" className="label">
              Βίντεο YouTube (προαιρετικά)
            </label>
            <input
              id="videoUrl"
              name="videoUrl"
              defaultValue={post.videoUrl}
              className="field text-sm"
              placeholder="https://www.youtube.com/watch?v=…"
            />
            {error("videoUrl") && <p className="mt-1.5 text-xs text-orange-700">{error("videoUrl")}</p>}
          </div>
        </div>
      </div>
    </form>
  );
}
