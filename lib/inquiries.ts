import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { isMissingSchemaError, prisma } from "@/lib/db";
import { inquirySubject, sendStudioLetter } from "@/lib/email";
import { parseBriefImages, parseStringArray } from "@/lib/imagine/brief-types";
import { getPublicBrief } from "@/lib/imagine/handoff";
import { site } from "@/lib/site";

export type InquiryRecord = {
  name: string;
  email: string;
  phone?: string;
  city: string;
  projectType: string;
  timeline: string;
  budgetBand: string;
  message: string;
  kind: "consult" | "pack";
  imagineSessionId?: string;
  photoUrl?: string;
  sessionId?: string | null;
  briefId?: string;
};

export async function persistInquiry(
  input: InquiryRecord,
): Promise<{ id: string; email: string; briefId: string | null }> {
  const brief = input.briefId ? await getPublicBrief(input.briefId) : null;
  const images = brief?.images ?? [];
  const selectedIds =
    brief?.selectedIds && brief.selectedIds.length > 0
      ? brief.selectedIds
      : images.filter((item) => item.selected || item.favorite).map((item) => item.id);

  const row = await prisma.inquiry.create({
    data: {
      sessionId: input.sessionId ?? null,
      briefId: brief?.id ?? null,
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      city: input.city,
      projectType: input.projectType,
      timeline: input.timeline,
      budgetBand: input.budgetBand,
      message: input.message,
      kind: input.kind,
      status: "new",
      generationIds: JSON.stringify(selectedIds),
      photoUrl: input.photoUrl ?? brief?.photoUrl ?? null,
      imagineSessionId: input.imagineSessionId ?? brief?.sessionId ?? null,
      prompt: brief?.prompt ?? "",
      transcript: brief?.transcript ?? "",
      studioPrompt: brief?.studioPrompt ?? "",
      styleTags: JSON.stringify(brief?.tags ?? []),
      summary: brief?.summary ?? "",
      selectedImageIds: JSON.stringify(selectedIds),
      images: JSON.stringify(images),
    },
  });

  try {
    await writeMailboxLetter(row.id, input, brief?.studioPrompt ?? "");
  } catch (error) {
    console.warn("Mailbox copy could not be written.", error);
  }

  await sendStudioLetter({
    to: process.env.STUDIO_INBOX_EMAIL || site.email,
    subject: inquirySubject(input.projectType, input.city),
    text: letterBody(input, {
      images: images.map((item) => item.url),
      transcript: brief?.transcript ?? "",
      prompt: brief?.prompt ?? "",
      studioPrompt: brief?.studioPrompt ?? "",
      tags: brief?.tags ?? [],
      selectedIds,
      photoUrl: input.photoUrl ?? brief?.photoUrl ?? null,
    }),
  });

  return { id: row.id, email: row.email, briefId: brief?.id ?? null };
}

export async function listInquiries() {
  try {
    return await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    if (isMissingSchemaError(error)) {
      return [];
    }
    throw error;
  }
}

export async function getInquiry(id: string) {
  try {
    return await prisma.inquiry.findUnique({ where: { id } });
  } catch (error) {
    if (isMissingSchemaError(error)) {
      return null;
    }
    throw error;
  }
}

export async function markInquiryReplied(id: string) {
  return prisma.inquiry.update({
    where: { id },
    data: { status: "replied", repliedAt: new Date() },
  });
}

export function inquiryImages(row: { images: string }) {
  return parseBriefImages(row.images);
}

export function inquiryTags(row: { styleTags: string }) {
  return parseStringArray(row.styleTags);
}

async function writeMailboxLetter(
  id: string,
  input: InquiryRecord,
  studioPrompt: string,
): Promise<void> {
  const folder = path.join(process.cwd(), ".data", "mailbox");
  await mkdir(folder, { recursive: true });
  const letter = letterBody(input, {
    images: [],
    transcript: "",
    prompt: "",
    studioPrompt,
    tags: [],
    selectedIds: [],
    photoUrl: input.photoUrl ?? null,
  });
  await writeFile(path.join(folder, `${id}.txt`), letter, "utf8");
}

function letterBody(
  input: InquiryRecord,
  extra: {
    images: string[];
    transcript: string;
    prompt: string;
    studioPrompt: string;
    tags: string[];
    selectedIds: string[];
    photoUrl: string | null;
  },
): string {
  return [
    `${site.legalName}`,
    `A letter received ${new Date().toISOString().slice(0, 10)}`,
    "",
    `From: ${input.name} <${input.email}>`,
    input.phone ? `Telephone: ${input.phone}` : null,
    `City: ${input.city}`,
    `Room: ${input.projectType}`,
    `Timeline: ${input.timeline}`,
    `Budget: ${input.budgetBand}`,
    extra.tags.length > 0 ? `Tags: ${extra.tags.join(", ")}` : null,
    extra.selectedIds.length > 0 ? `Selected stills: ${extra.selectedIds.join(", ")}` : null,
    extra.photoUrl ? `Photograph: ${extra.photoUrl}` : "Photograph: none",
    extra.images.length > 0 ? `Images:\n${extra.images.map((url) => `- ${url}`).join("\n")}` : null,
    "",
    "Note",
    input.message,
    extra.prompt ? `\nOriginal words\n${extra.prompt}` : null,
    extra.transcript ? `\nTranscript\n${extra.transcript}` : null,
    extra.studioPrompt ? `\nStudio prompt\n${extra.studioPrompt}` : null,
    "",
    `Kind: ${input.kind}`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
