import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "minimatchuz@gmail.com",
        pass: "xdhrzomrijijfdyx",
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string , html : string) {
    const mailOptions = {
      from: "minimatchuz@gmail.com", // Sender email address
      to,
      subject,
      text,
      html,
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }
}
