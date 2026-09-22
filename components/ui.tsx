import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{children}</p>
  );
}

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-ink underline decoration-line underline-offset-[6px] transition-colors hover:decoration-ink"
    >
      {children}
    </Link>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center px-7 py-3 text-[12px] uppercase tracking-[0.18em] transition-colors",
        variant === "solid" && "bg-ink text-paper hover:bg-ink-soft",
        variant === "outline" && "border border-ink text-ink hover:bg-ink hover:text-paper",
      )}
    >
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "solid",
  type = "button",
  disabled,
  onClick,
  className,
  "aria-label": ariaLabel,
  "aria-pressed": ariaPressed,
  "aria-live": ariaLive,
}: {
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
  "aria-live"?: "polite" | "assertive" | "off";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-live={ariaLive}
      className={cn(
        "inline-flex items-center justify-center px-7 py-3 text-[12px] uppercase tracking-[0.18em] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        variant === "solid" && "bg-ink text-paper hover:bg-ink-soft",
        variant === "outline" && "border border-ink text-ink hover:bg-ink hover:text-paper",
        variant === "ghost" &&
          "px-0 py-0 text-ink underline decoration-line underline-offset-[6px] hover:decoration-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[12px] uppercase tracking-[0.16em] text-ink">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-sm text-muted">{hint}</p> : null}
      {error ? (
        <p className="text-sm text-ink-soft" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const fieldClass =
  "w-full border border-line bg-paper px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-ink";

export function Notice({
  children,
  tone = "quiet",
}: {
  children: ReactNode;
  tone?: "quiet" | "caution";
}) {
  return (
    <p
      role={tone === "caution" ? "alert" : "status"}
      className={cn(
        "border px-4 py-3 text-sm leading-6",
        tone === "caution" ? "border-line bg-paper-2 text-ink-soft" : "border-line text-muted",
      )}
    >
      {children}
    </p>
  );
}
