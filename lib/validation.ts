import { z } from "zod";
import { isStyleTagId } from "@/lib/styles";
import { budgetBands, roomTypes, timelines } from "@/lib/site";

export const generateSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(24, "A few sentences is enough. Tell us the room, the light, and how it should feel.")
    .max(800, "Keep it under a few paragraphs. The studio can ask the rest."),
  transcript: z.string().trim().max(800).optional().nullable(),
  styleTags: z
    .array(z.string().refine(isStyleTagId, "Unknown tag."))
    .max(3, "Three tags at most.")
    .default([]),
});

export const transcribeSchema = z.object({
  hint: z.string().trim().max(800).optional().nullable(),
  durationSeconds: z.coerce.number().min(0).max(120).optional(),
});

export const imagineGenerateSchema = z.object({
  rawText: z.string().trim().max(800).default(""),
  transcript: z.string().trim().max(800).default(""),
  styleTags: z
    .array(z.string())
    .max(12)
    .default([])
    .transform((tags) => tags.filter(isStyleTagId).slice(0, 3)),
  constraints: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  source: z.enum(["voice", "text", "photo"]),
  n: z.coerce.number().int().min(1).max(4).default(4),
  refine: z.string().trim().max(120).optional(),
  charge: z.enum(["true", "false"]).default("true"),
});

export const favoriteSchema = z.object({
  generationId: z.string().min(1),
  imageId: z.string().min(1),
});

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Your name.").max(80),
  email: z.string().trim().email("A working email, so we can write back."),
  phone: z.preprocess(
    emptyToUndefined,
    z.string().min(7, "A telephone number, or leave it blank.").max(40).optional(),
  ),
  city: z.string().trim().min(2, "The city, or the nearest town.").max(80),
  projectType: z.enum(roomTypes, { message: "Choose a space." }),
  timeline: z.enum(timelines, { message: "Choose a timeline." }),
  budgetBand: z.enum(budgetBands, { message: "Choose a budget band." }),
  message: z
    .string()
    .trim()
    .min(20, "A little about the rooms is enough.")
    .max(2000),
  kind: z.enum(["consult", "pack"]).default("consult"),
  imagineSessionId: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .min(8, "That session id is too short.")
      .max(80, "That session id is too long.")
      .regex(/^[\w-]+$/, "Use the id from Imagine, or leave this blank.")
      .optional(),
  ),
  briefId: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .min(8, "That brief id is too short.")
      .max(80)
      .regex(/^[\w-]+$/)
      .optional(),
  ),
  resumeToken: z.preprocess(
    emptyToUndefined,
    z.string().min(8).max(80).optional(),
  ),
});

export const PHOTO_MAX_BYTES = 10 * 1024 * 1024;
export const AUDIO_MAX_BYTES = 6 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const ALLOWED_AUDIO_TYPES = [
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/x-m4a",
  "audio/aac",
] as const;

export function isAllowedPhotoType(
  value: string,
): value is (typeof ALLOWED_PHOTO_TYPES)[number] {
  return (ALLOWED_PHOTO_TYPES as readonly string[]).includes(value);
}

export function isAllowedAudioType(value: string): boolean {
  const base = value.split(";")[0]?.trim().toLowerCase() ?? "";
  return (ALLOWED_AUDIO_TYPES as readonly string[]).includes(base);
}
