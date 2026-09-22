import { consoleEmailProvider } from "@/lib/email/console";
import { resendEmailProvider } from "@/lib/email/resend";
import { smtpEmailProvider } from "@/lib/email/smtp";
import type { EmailProvider, StudioEmail } from "@/lib/email/types";
import { site } from "@/lib/site";

export type { StudioEmail };

export function getEmailProvider(): EmailProvider {
  const name = (process.env.EMAIL_PROVIDER ?? "console").trim().toLowerCase();
  if (name === "resend") {
    return process.env.RESEND_API_KEY ? resendEmailProvider : consoleEmailProvider;
  }
  if (name === "smtp") {
    return process.env.SMTP_HOST ? smtpEmailProvider : consoleEmailProvider;
  }
  return consoleEmailProvider;
}

export async function sendStudioLetter(message: StudioEmail): Promise<void> {
  const provider = getEmailProvider();
  try {
    await provider.send({
      ...message,
      to: message.to || process.env.STUDIO_INBOX_EMAIL || site.email,
    });
  } catch (error) {
    console.error("[email]", provider.name, error instanceof Error ? error.name : "unknown");
    if (provider.name !== "console") {
      await consoleEmailProvider.send(message);
    }
  }
}

export function inquirySubject(room: string, city: string): string {
  const place = city.trim() || "unknown city";
  const kind = room.trim().toLowerCase() || "room";
  return `New room brief — ${kind} — ${place}`;
}
