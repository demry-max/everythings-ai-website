"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginClient() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const router = useRouter();

  const next = params.get("next") || "/admin";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Login failed");
      return;
    }

    router.replace(next);
  }

  return (
    <form onSubmit={onSubmit} className="w-full rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <p className="mt-2 text-sm text-white/70">Enter your admin password.</p>

      <label className="mt-6 block text-sm font-medium">Password</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-white/30"
        placeholder="admin123"
      />

      {error ? <div className="mt-3 text-sm text-red-300">{error}</div> : null}

      <button
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
