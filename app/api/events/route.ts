import { NextResponse } from "next/server";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { logInfo, requestIdFrom } from "@/lib/log";

const events = new Set<string>(ANALYTICS_EVENTS);

export async function POST(request: Request) {
  const requestId = requestIdFrom(request.headers);
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null || !("event" in payload)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = payload.event;
  if (typeof event !== "string" || !events.has(event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const demo =
    "demo" in payload && typeof payload.demo === "boolean" ? payload.demo : undefined;
  const n = "n" in payload && typeof payload.n === "number" ? payload.n : undefined;

  logInfo("analytics", event, { requestId, demo, n });
  return NextResponse.json({ ok: true });
}
