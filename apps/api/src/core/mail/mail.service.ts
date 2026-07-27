import { Injectable, Logger } from "@nestjs/common";

const RESEND_API_KEY = process.env["RESEND_API_KEY"];
const MAIL_FROM = process.env["MAIL_FROM"] ?? "Clube das Musas <onboarding@resend.dev>";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async send(to: string[], subject: string, html: string) {
    if (to.length === 0) return;

    if (!RESEND_API_KEY) {
      this.logger.warn(`RESEND_API_KEY não configurada — e-mail "${subject}" não enviado.`);
      return;
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: MAIL_FROM, to, subject, html }),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        this.logger.error(`Falha ao enviar e-mail "${subject}": ${response.status} ${body}`);
      }
    } catch (err) {
      this.logger.error(`Falha ao enviar e-mail "${subject}": ${(err as Error).message}`);
    }
  }
}
