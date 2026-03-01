import { NextResponse } from "next/server";
import { isAdminToken } from "@/lib/auth";
import { getContent, setContent, type SiteContent } from "@/lib/storage";
import { cookies } from "next/headers";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(req: Request) {
  const token = (await cookies()).get("adminToken")?.value;
  if (!isAdminToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const next = (await req.json()) as SiteContent;
  const saved = await setContent(next);
  return NextResponse.json(saved);
}
