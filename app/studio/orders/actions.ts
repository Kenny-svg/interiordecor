"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { markOrderStatus } from "@/lib/orders";
import { isInboxAuthed } from "@/lib/studio-auth";

export async function updateOrderStatus(formData: FormData): Promise<void> {
  if (!(await isInboxAuthed())) {
    redirect("/studio/inbox");
  }
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || (status !== "new" && status !== "confirmed" && status !== "closed")) {
    return;
  }
  await markOrderStatus(id, status);
  revalidatePath("/studio/orders");
  revalidatePath(`/studio/orders/${id}`);
  redirect(`/studio/orders/${id}`);
}
