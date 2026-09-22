import { headers } from "next/headers";

export async function publicOrigin(): Promise<string> {
  const fromEnv = (process.env.PUBLIC_APP_URL ?? process.env.SITE_URL)?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  if (!host) {
    return "http://localhost:3000";
  }
  const proto = headerStore.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
