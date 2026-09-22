import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const INBOX_COOKIE = "hale_studio_inbox";

export function inboxPassword(): string | null {
  const value = process.env.STUDIO_INBOX_PASSWORD?.trim();
  return value && value.length > 0 ? value : null;
}

export function inboxCookieValue(password: string): string {
  return createHmac("sha256", password).update("hale-studio-inbox").digest("hex");
}

export function inboxCookieMatches(cookie: string | undefined, password: string): boolean {
  if (!cookie) {
    return false;
  }
  const expected = Buffer.from(inboxCookieValue(password));
  const given = Buffer.from(cookie);
  if (expected.length !== given.length) {
    return false;
  }
  return timingSafeEqual(expected, given);
}

export async function isInboxAuthed(): Promise<boolean> {
  const password = inboxPassword();
  if (!password) {
    return false;
  }
  const jar = await cookies();
  return inboxCookieMatches(jar.get(INBOX_COOKIE)?.value, password);
}
