import { kv } from "@vercel/kv";

export type SiteContent = {
  nav: { ctaText: string };
  hero: { badge: string; title: string; titleAccent: string; subtitle: string };
  contactEmail: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMd: string;
  status: "draft" | "published";
  tags: string[];
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
};

const KEYS = {
  content: "site:content:v1",
  articles: "site:articles:v1",
};

function kvEnabled() {
  // Vercel KV uses env vars in production; in dev/local they might be missing.
  // If missing, @vercel/kv will still exist but calls will fail.
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

const defaultContent: SiteContent = {
  nav: { ctaText: "Get Started" },
  hero: {
    badge: "Philippines' AI Innovation Hub",
    title: "Build the Future",
    titleAccent: "with AI.",
    subtitle:
      "Everything's AI is building the next generation of AI talent in the Philippines — empowering builders, entrepreneurs, and children to thrive in the age of artificial intelligence.",
  },
  contactEmail: "hello@everythingsai.ph",
};

const defaultArticles: Article[] = [
  {
    id: "1",
    title: "Introducing Everything's AI",
    slug: "introducing-everythings-ai",
    excerpt:
      "Why we're building the Philippines' AI innovation hub — and how you can join.",
    contentMd:
      "# Introducing Everything's AI\n\nWe're building the next generation of AI talent in the Philippines.\n\n## What we do\n- AI Incubator for builders\n- Academy Tutor for kids\n\nStay tuned for upcoming programs and events.",
    status: "published",
    tags: ["announcement"],
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getContent(): Promise<SiteContent> {
  if (!kvEnabled()) return defaultContent;
  const v = await kv.get<SiteContent>(KEYS.content);
  if (v) return v;
  await kv.set(KEYS.content, defaultContent);
  return defaultContent;
}

export async function setContent(next: SiteContent): Promise<SiteContent> {
  if (!kvEnabled()) return next; // in dev, pretend saved
  await kv.set(KEYS.content, next);
  return next;
}

export async function listArticles(status?: "draft" | "published"): Promise<Article[]> {
  if (!kvEnabled()) {
    return status ? defaultArticles.filter((a) => a.status === status) : defaultArticles;
  }
  let items = (await kv.get<Article[]>(KEYS.articles)) || null;
  if (!items) {
    await kv.set(KEYS.articles, defaultArticles);
    items = defaultArticles;
  }
  return status ? items.filter((a) => a.status === status) : items;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const items = await listArticles();
  return items.find((a) => a.id === id) || null;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const items = await listArticles();
  return items.find((a) => a.slug === slug) || null;
}

export async function upsertArticle(article: Article): Promise<Article> {
  const now = new Date().toISOString();
  const items = await listArticles();
  const idx = items.findIndex((a) => a.id === article.id);
  const next: Article = {
    ...article,
    updatedAt: now,
    createdAt: article.createdAt || now,
    publishedAt: article.status === "published" ? article.publishedAt || now : undefined,
  };

  const newItems = [...items];
  if (idx >= 0) newItems[idx] = next;
  else newItems.unshift(next);

  if (kvEnabled()) await kv.set(KEYS.articles, newItems);
  return next;
}

export async function deleteArticle(id: string) {
  const items = await listArticles();
  const newItems = items.filter((a) => a.id !== id);
  if (kvEnabled()) await kv.set(KEYS.articles, newItems);
  return { ok: true };
}
