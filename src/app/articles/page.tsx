import Link from "next/link";
import { listArticles } from "@/lib/storage";

export default async function ArticlesPage() {
  const items = await listArticles("published");

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="mt-2 text-zinc-600">Latest updates from Everything&apos;s AI.</p>
        </div>
        <Link className="text-sm font-medium underline" href="/">
          Back to home
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <Link
            key={a.id}
            href={`/articles/${a.slug}`}
            className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow"
          >
            <div className="text-xs text-zinc-500">
              {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ""}
            </div>
            <div className="mt-2 text-lg font-semibold">{a.title}</div>
            <div className="mt-2 text-sm text-zinc-600">{a.excerpt}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {a.tags.map((t) => (
                <span key={t} className="rounded-full bg-zinc-100 px-2 py-1 text-xs">
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
