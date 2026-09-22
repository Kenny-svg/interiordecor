"use server";

import { persistInquiry } from "@/lib/inquiries";
import { magicUrlFor } from "@/lib/imagine/handoff";
import { persistUploadPublic } from "@/lib/media";
import { publicOrigin } from "@/lib/origin";
import { ensureSession, getSessionId } from "@/lib/session";
import { site } from "@/lib/site";
import { prepareImageUpload } from "@/lib/uploads";
import { inquirySchema } from "@/lib/validation";

export type InquiryState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | {
      status: "ok";
      email: string;
      reply: string;
      magicUrl: string | null;
    };

export async function submitInquiry(
  _previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    projectType: formData.get("projectType"),
    timeline: formData.get("timeline"),
    budgetBand: formData.get("budgetBand"),
    message: formData.get("message"),
    kind: formData.get("kind") || "consult",
    imagineSessionId: formData.get("imagineSessionId"),
    briefId: formData.get("briefId"),
    resumeToken: formData.get("resumeToken"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please look over the letter.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const photoResult = await readPhoto(formData.get("photo"));
  if (photoResult.status === "error") {
    return {
      status: "error",
      message: "Please look over the letter.",
      fieldErrors: { photo: photoResult.message },
    };
  }

  const sessionId = await getSessionId();
  if (sessionId) {
    await ensureSession(sessionId);
  }

  const saved = await persistInquiry({
    sessionId,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    city: parsed.data.city,
    projectType: parsed.data.projectType,
    timeline: parsed.data.timeline,
    budgetBand: parsed.data.budgetBand,
    message: parsed.data.message,
    kind: parsed.data.kind,
    imagineSessionId: parsed.data.imagineSessionId,
    photoUrl: photoResult.url,
    briefId: parsed.data.briefId,
  });

  const origin = await publicOrigin();
  const magicUrl =
    parsed.data.briefId && parsed.data.resumeToken
      ? await magicUrlFor(parsed.data.briefId, parsed.data.resumeToken, origin)
      : null;

  return {
    status: "ok",
    email: saved.email,
    reply: site.reply,
    magicUrl,
  };
}

function fieldErrorsFromZod(
  issues: Array<{ path: PropertyKey[]; message: string }>,
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

async function readPhoto(
  value: FormDataEntryValue | null,
): Promise<{ status: "ok"; url?: string } | { status: "error"; message: string }> {
  if (!(value instanceof File) || value.size === 0) {
    return { status: "ok" };
  }
  const prepared = await prepareImageUpload(value);
  if ("error" in prepared) {
    return { status: "error", message: prepared.error };
  }
  const url = await persistUploadPublic(prepared.bytes, prepared.ext);
  return { status: "ok", url };
}
