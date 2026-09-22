import { z } from "zod";
import type { ConceptSummary } from "@/lib/imagine/session-store";

const summarySchema = z.object({
  palette: z.string().max(400).default(""),
  materials: z.string().max(400).default(""),
  mood: z.string().max(400).default(""),
});

export const handoffStillSchema = z.object({
  id: z.string().min(1).max(80),
  url: z.string().min(1).max(2000),
  alt: z.string().max(400).default(""),
  favorite: z.boolean().default(false),
  selected: z.boolean().default(false),
  summary: summarySchema.default({ palette: "", materials: "", mood: "" }),
});

export const handoffPayloadSchema = z.object({
  sessionId: z.string().min(8).max(80).regex(/^[\w-]+$/),
  prompt: z.string().max(800).default(""),
  transcript: z.string().max(800).default(""),
  studioPrompt: z.string().max(4000).default(""),
  tags: z.array(z.string().max(40)).max(8).default([]),
  selectedIds: z.array(z.string().max(80)).max(8).default([]),
  images: z.array(handoffStillSchema).max(8),
});

export type HandoffStill = z.infer<typeof handoffStillSchema>;
export type HandoffPayload = z.infer<typeof handoffPayloadSchema>;
export type { ConceptSummary };
