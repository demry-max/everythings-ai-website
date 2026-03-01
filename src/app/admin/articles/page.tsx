"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Article } from "@/lib/storage";

export default function AdminArticlesPage() {
  const [items, setItems] = useState<Article[]>([]);

  async function load() {
    const res = await fetch("/api/articles");
    const j = await res.json();
    setItems(j);
  }

  useEffect(() => {
    load();
  }, []);

  async function del(id: string) {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <main>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Articles</h1>
          <p className="mt-1 text-sm text-zinc-600">Create and publish articles.</p>
        </div>
        <Link className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white" href="/admin/articles/new">
          New Article
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-zinc-500">/{a.slug}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${a.status === "published" ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-700"}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-600">{new Date(a.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <Link className="mr-3 text-sm underline" href={`/admin/articles/${a.id}/edit`}>
                    Edit
                  </Link>
                  <button className="text-sm underline text-red-600" onClick={() => del(a.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
