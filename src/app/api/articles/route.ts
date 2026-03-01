import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminToken } from "@/lib/auth";
import { listArticles, upsertArticle, type Article } from "@/lib/storage";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as "draft" | "published" | null;
  const items = await listArticles(status || undefined);
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const token = (await cookies()).get("adminToken")?.value;
  if (!isAdminToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as Partial<Article>;
  if (!body.title || !body.slug) return NextResponse.json({ error: "Missing title/slug" }, { status: 400 });

  const now = new Date().toISOString();
  const article: Article = {
    id: body.id || crypto.randomUUID(),
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt || "",
    contentMd: body.contentMd || "",
    status: body.status === "published" ? "published" : "draft",
    tags: Array.isArray(body.tags) ? body.tags : [],
    createdAt: body.createdAt || now,
    updatedAt: now,
    publishedAt: body.status === "published" ? body.publishedAt || now : undefined,
  };

  const saved = await upsertArticle(article);
  return NextResponse.json(saved);
}
