import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
        <Suspense fallback={<div className="text-sm text-white/70">Loading…</div>}>
          <LoginClient />
        </Suspense>
      </div>
    </main>
  );
}
