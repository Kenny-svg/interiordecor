import { site } from "@/lib/site";
import type { EmailProvider, StudioEmail } from "@/lib/email/types";

export const consoleEmailProvider: EmailProvider = {
  name: "console",
  async send(message: StudioEmail): Promise<void> {
    console.info("[email.console]", {
      to: message.to || site.email,
      subject: message.subject,
      text: message.text,
    });
  },
};
