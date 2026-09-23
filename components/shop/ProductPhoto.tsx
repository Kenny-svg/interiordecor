import Image from "next/image";
import { cn } from "@/lib/utils";
import { PAPER_BLUR } from "@/components/work/Still";

export function ProductPhoto({
  src,
  alt,
  sizes,
  priority = false,
  className,
  contained = false,
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  contained?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-paper-2", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={PAPER_BLUR}
          className={contained ? "object-contain object-bottom p-6" : "object-cover"}
        />
      ) : (
        <div className="absolute inset-0 flex items-end p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Photograph to follow</p>
        </div>
      )}
    </div>
  );
}
