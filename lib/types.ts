export type PublicImage = {
  id: string;
  url: string;
  alt: string;
};

export type PublicGeneration = {
  id: string;
  prompt: string;
  transcript: string | null;
  styleTags: string[];
  hasRoomPhoto: boolean;
  summary: string;
  images: PublicImage[];
  createdAt: string;
};

export type Budget = {
  remaining: number;
  used: number;
  limit: number;
};

export type GenerateResponse = {
  generation: PublicGeneration;
  budget: Budget;
};

export type ApiError = {
  error: string;
  code?: string;
};
