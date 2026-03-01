import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-zinc-950 p-6 text-white">
          <div className="text-lg font-bold">Everything&apos;s AI</div>
          <nav className="mt-8 space-y-2 text-sm">
            <Link className="block rounded-lg px-3 py-2 hover:bg-white/10" href="/admin">
              Dashboard
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-white/10" href="/admin/content">
              Edit Content
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-white/10" href="/admin/articles">
              Articles
            </Link>
            <form
              action="/api/auth/logout"
              method="post"
              className="pt-4"
            >
              <button className="w-full rounded-lg bg-white/10 px-3 py-2 text-left hover:bg-white/15">
                Logout
              </button>
            </form>
          </nav>
        </aside>
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  );
}
