import { ProviderError } from "@/lib/providers/types";
import type { EmailProvider, StudioEmail } from "@/lib/email/types";

export const resendEmailProvider: EmailProvider = {
  name: "resend",
  async send(message: StudioEmail): Promise<void> {
    const key = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!key || !from) {
      throw new ProviderError("RESEND_API_KEY or EMAIL_FROM is not set.", "config");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
      }),
    });

    if (!response.ok) {
      throw new ProviderError("Resend refused the letter.", "upstream");
    }
  },
};
