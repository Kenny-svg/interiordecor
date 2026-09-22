import { NextResponse } from "next/server";
import { getBriefByMagicHash } from "@/lib/imagine/handoff";
import { hashToken } from "@/lib/magic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim();
  if (!token) {
    return NextResponse.json({ error: "Missing link." }, { status: 400 });
  }
  const brief = await getBriefByMagicHash(hashToken(token));
  if (!brief) {
    return NextResponse.json(
      { error: "This link has ended. The stills last seven days." },
      { status: 410 },
    );
  }
  return NextResponse.json({ brief });
}
