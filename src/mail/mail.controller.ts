import { Controller, Post, Body } from "@nestjs/common";
import { MailService } from "./mail.service";

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: MailService) {}

  @Post("send")
  async sendEmail(
    @Body() emailData: { to: string; subject: string; text: string ; html : string },
  ) {
    try {
      const { to, subject, text , html } = emailData;
      const info = await this.emailService.sendEmail(to, subject, text , html);
      return { message: "Email sent successfully", info };
    } catch (error) {
      return { message: "Failed to send email", error: error.message };
    }
  }
}
