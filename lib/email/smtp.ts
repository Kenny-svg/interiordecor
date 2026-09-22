import { createConnection, type Socket } from "node:net";
import { connect as tlsConnect, type TLSSocket } from "node:tls";
import { ProviderError } from "@/lib/providers/types";
import type { EmailProvider, StudioEmail } from "@/lib/email/types";

export const smtpEmailProvider: EmailProvider = {
  name: "smtp",
  async send(message: StudioEmail): Promise<void> {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM ?? user;
    const port = Number(process.env.SMTP_PORT ?? "587");
    if (!host || !user || !pass || !from) {
      throw new ProviderError("SMTP_HOST, SMTP_USER, SMTP_PASS, or EMAIL_FROM is not set.", "config");
    }

    const client = new SmtpSession({
      host,
      port,
      secure: port === 465,
    });

    try {
      await client.connect();
      await client.command(`EHLO hale.studio`, 250);
      if (!client.secure) {
        await client.startTls();
        await client.command(`EHLO hale.studio`, 250);
      }
      await client.command("AUTH LOGIN", 334);
      await client.command(Buffer.from(user).toString("base64"), 334);
      await client.command(Buffer.from(pass).toString("base64"), 235);
      await client.command(`MAIL FROM:<${from}>`, 250);
      await client.command(`RCPT TO:<${message.to}>`, 250);
      await client.command("DATA", 354);
      const payload = [
        `From: ${from}`,
        `To: ${message.to}`,
        `Subject: ${message.subject}`,
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=utf-8",
        "",
        message.text.replace(/^\./gm, ".."),
        ".",
      ].join("\r\n");
      await client.command(payload, 250);
      await client.command("QUIT", 221);
    } finally {
      client.close();
    }
  },
};

class SmtpSession {
  host: string;
  port: number;
  secure: boolean;
  private socket: Socket | TLSSocket | null = null;
  private buffer = "";

  constructor(input: { host: string; port: number; secure: boolean }) {
    this.host = input.host;
    this.port = input.port;
    this.secure = input.secure;
  }

  async connect(): Promise<void> {
    this.socket = this.secure
      ? tlsConnect({ host: this.host, port: this.port, servername: this.host })
      : createConnection({ host: this.host, port: this.port });
    await this.expect(220);
  }

  async startTls(): Promise<void> {
    await this.command("STARTTLS", 220);
    const plain = this.socket;
    if (!plain) {
      throw new ProviderError("SMTP socket missing.", "upstream");
    }
    const upgraded = tlsConnect({ socket: plain, servername: this.host });
    await new Promise<void>((resolve, reject) => {
      upgraded.once("secureConnect", () => resolve());
      upgraded.once("error", reject);
    });
    this.socket = upgraded;
    this.secure = true;
    this.buffer = "";
  }

  async command(line: string, ok: number): Promise<string> {
    await this.write(line);
    return this.expect(ok);
  }

  close(): void {
    this.socket?.end();
    this.socket = null;
  }

  private write(line: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new ProviderError("SMTP socket missing.", "upstream"));
        return;
      }
      this.socket.write(`${line}\r\n`, (error) => (error ? reject(error) : resolve()));
    });
  }

  private expect(ok: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const socket = this.socket;
      if (!socket) {
        reject(new ProviderError("SMTP socket missing.", "upstream"));
        return;
      }
      const onData = (chunk: Buffer) => {
        this.buffer += chunk.toString("utf8");
        if (!this.buffer.includes("\n")) {
          return;
        }
        const lines = this.buffer.split(/\r?\n/).filter((line) => line.length > 0);
        const last = lines[lines.length - 1] ?? "";
        if (/^\d{3}-/.test(last)) {
          return;
        }
        socket.off("data", onData);
        socket.off("error", onError);
        const code = Number(last.slice(0, 3));
        const classOk = Math.floor(code / 100) === Math.floor(ok / 100);
        if (code !== ok && !classOk) {
          reject(new ProviderError(`SMTP ${code || "error"}`, "upstream"));
          return;
        }
        const body = this.buffer;
        this.buffer = "";
        resolve(body);
      };
      const onError = (error: Error) => {
        socket.off("data", onData);
        reject(error);
      };
      socket.on("data", onData);
      socket.once("error", onError);
    });
  }
}
