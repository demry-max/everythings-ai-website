"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/storage";

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then(setContent)
      .catch(() => setStatus("Failed to load content"));
  }, []);

  async function save() {
    if (!content) return;
    setStatus("Saving…");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(content),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
  }

  if (!content) return <div>Loading…</div>;

  return (
    <main>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Content</h1>
          <p className="mt-1 text-sm text-zinc-600">Edits are stored in Vercel KV (when configured).</p>
        </div>
        <button onClick={save} className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white">
          Save
        </button>
      </div>

      {status ? <div className="mt-3 text-sm text-zinc-600">{status}</div> : null}

      <div className="mt-8 grid gap-6">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="font-semibold">Hero</h2>
          <label className="mt-4 block text-sm">Badge</label>
          <input className="mt-2 w-full rounded-xl border px-4 py-2" value={content.hero.badge} onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })} />

          <label className="mt-4 block text-sm">Title</label>
          <input className="mt-2 w-full rounded-xl border px-4 py-2" value={content.hero.title} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })} />

          <label className="mt-4 block text-sm">Title Accent</label>
          <input className="mt-2 w-full rounded-xl border px-4 py-2" value={content.hero.titleAccent} onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleAccent: e.target.value } })} />

          <label className="mt-4 block text-sm">Subtitle</label>
          <textarea className="mt-2 w-full rounded-xl border px-4 py-2" rows={4} value={content.hero.subtitle} onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })} />
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="font-semibold">Contact</h2>
          <label className="mt-4 block text-sm">Contact email</label>
          <input className="mt-2 w-full rounded-xl border px-4 py-2" value={content.contactEmail} onChange={(e) => setContent({ ...content, contactEmail: e.target.value })} />
        </section>
      </div>
    </main>
  );
}
