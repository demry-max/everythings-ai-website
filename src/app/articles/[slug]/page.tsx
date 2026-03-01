import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getArticleBySlug } from "@/lib/storage";
import { notFound } from "next/navigation";

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") return notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link className="text-sm font-medium underline" href="/articles">
        ← Back to articles
      </Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">{article.title}</h1>
      <div className="mt-2 text-sm text-zinc-500">
        {article.publishedAt ? new Date(article.publishedAt).toLocaleString() : ""}
      </div>
      <article className="prose prose-zinc mt-10 max-w-none">
        <ReactMarkdown>{article.contentMd}</ReactMarkdown>
      </article>
    </main>
  );
}
