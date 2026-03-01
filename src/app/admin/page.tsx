export default function AdminHome() {
  return (
    <main>
      <h1 className="text-3xl font-bold">Admin</h1>
      <p className="mt-2 text-zinc-600">Manage content and publish articles.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <a href="/admin/content" className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow">
          <div className="text-sm font-semibold">Edit website content</div>
          <div className="mt-2 text-sm text-zinc-600">Hero, CTA, email, etc.</div>
        </a>
        <a href="/admin/articles" className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow">
          <div className="text-sm font-semibold">Manage articles</div>
          <div className="mt-2 text-sm text-zinc-600">Create, edit, publish.</div>
        </a>
      </div>
    </main>
  );
}
