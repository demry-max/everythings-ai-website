import { NextResponse } from "next/server";
import { expectedAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const password = body?.password as string | undefined;
  if (!password) return NextResponse.json({ error: "Missing password" }, { status: 400 });

  const ok = password === expectedAdminToken();
  if (!ok) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "adminToken",
    value: expectedAdminToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return res;
}
