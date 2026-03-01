import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/storage";

export default async function Home() {
  const content = await getContent();

  return (
    <div>
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-dark.svg" alt="Everything's AI" width={180} height={60} priority />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/articles" className="hover:underline">Articles</Link>
            <a href="mailto:hello@everythingsai.ph" className="rounded-full bg-zinc-950 px-4 py-2 text-white">
              {content.nav.ctaText}
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs text-zinc-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {content.hero.badge}
          </div>
          <h1 className="mt-8 text-5xl font-black tracking-tight">
            {content.hero.title} <span className="text-blue-600">{content.hero.titleAccent}</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">{content.hero.subtitle}</p>

          <div className="mt-10 flex gap-4">
            <a href="/admin" className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white">
              Admin
            </a>
            <a href="/articles" className="rounded-xl border px-5 py-3 text-sm font-semibold">
              Read Articles
            </a>
          </div>

          <p className="mt-6 text-sm text-zinc-500">
            Contact: <a className="underline" href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>
          </p>
        </div>
      </main>
    </div>
  );
}
