"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import slugify from "slugify";

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentMd, setContentMd] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const autoSlug = useMemo(() => slugify(title || "", { lower: true, strict: true }), [title]);

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((r) => r.json())
      .then((a) => {
        setTitle(a.title || "");
        setSlug(a.slug || "");
        setExcerpt(a.excerpt || "");
        setContentMd(a.contentMd || "");
        setTags(Array.isArray(a.tags) ? a.tags.join(", ") : "");
        setStatus(a.status === "published" ? "published" : "draft");
        setLoaded(true);
      })
      .catch(() => setError("Failed to load"));
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id,
        title,
        slug: slug || autoSlug,
        excerpt,
        contentMd,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Save failed");
      return;
    }

    router.push("/admin/articles");
  }

  if (!loaded) return <div>Loading…</div>;

  return (
    <main>
      <h1 className="text-2xl font-bold">Edit Article</h1>
      <form onSubmit={save} className="mt-6 grid gap-4 rounded-2xl border bg-white p-6">
        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <label className="text-sm">Title</label>
        <input className="rounded-xl border px-4 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label className="text-sm">Slug</label>
        <input className="rounded-xl border px-4 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={autoSlug} />

        <label className="text-sm">Excerpt</label>
        <textarea className="rounded-xl border px-4 py-2" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />

        <label className="text-sm">Content (Markdown)</label>
        <textarea className="rounded-xl border px-4 py-2 font-mono text-sm" rows={12} value={contentMd} onChange={(e) => setContentMd(e.target.value)} />

        <label className="text-sm">Tags (comma separated)</label>
        <input className="rounded-xl border px-4 py-2" value={tags} onChange={(e) => setTags(e.target.value)} />

        <label className="text-sm">Status</label>
        <select className="rounded-xl border px-4 py-2" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button className="mt-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white">Save</button>
      </form>
    </main>
  );
}
