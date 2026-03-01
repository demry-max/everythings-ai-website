import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminToken } from "@/lib/auth";
import {
  deleteArticle,
  getArticleById,
  upsertArticle,
  type Article,
} from "@/lib/storage";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const item = await getArticleById(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get("adminToken")?.value;
  if (!isAdminToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = (await req.json()) as Article;
  if (!body.title || !body.slug) return NextResponse.json({ error: "Missing title/slug" }, { status: 400 });

  const saved = await upsertArticle({ ...body, id });
  return NextResponse.json(saved);
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get("adminToken")?.value;
  if (!isAdminToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  await deleteArticle(id);
  return NextResponse.json({ ok: true });
}
