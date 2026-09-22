"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  INBOX_COOKIE,
  inboxCookieValue,
  inboxPassword,
  isInboxAuthed,
} from "@/lib/studio-auth";
import { markInquiryReplied } from "@/lib/inquiries";

export async function loginInbox(formData: FormData): Promise<void> {
  const password = inboxPassword();
  const given = String(formData.get("password") ?? "");
  if (!password || given !== password) {
    redirect("/studio/inbox?error=1");
  }
  const jar = await cookies();
  jar.set({
    name: INBOX_COOKIE,
    value: inboxCookieValue(password),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/studio/inbox");
}

export async function logoutInbox(): Promise<void> {
  const jar = await cookies();
  jar.delete(INBOX_COOKIE);
  redirect("/studio/inbox");
}

export async function replyInquiry(formData: FormData): Promise<void> {
  if (!(await isInboxAuthed())) {
    redirect("/studio/inbox");
  }
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  await markInquiryReplied(id);
  redirect(`/studio/inbox/${id}`);
}
