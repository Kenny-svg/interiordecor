import Image from "next/image";
import { cn } from "@/lib/utils";

/** Warm paper LQIP so remote stills reserve space without a layout shift. */
export const PAPER_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAAEAAQMBIgACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAABAwQG/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJgA/9k=";

const aspects = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  hero: "aspect-[4/5] sm:aspect-[16/9]",
  fill: "h-full w-full",
} as const;

export function Still({
  src,
  alt,
  sizes,
  position = "50% 50%",
  aspect = "portrait",
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  position?: string;
  aspect?: keyof typeof aspects;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-paper-2", aspects[aspect], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={PAPER_BLUR}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
