import transporter from "../utils/mail.config.js";

interface EmailAttachment {
  filename: string;
  path?: string;
  content?: string | Buffer;
  contentType?: string;
  cid?: string;
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

class EmailService {
  async sendEmail({
    to,
    subject,
    html,
    attachments = [],
  }: EmailOptions): Promise<void> {
    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
        attachments,
      });

      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error("Failed to send email");
      throw error;
    }
  }
}

export default new EmailService();
