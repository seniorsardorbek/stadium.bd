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

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: "minimatchuz@gmail.com", // Sender email address
      to: "sardorbekmusilman@gmail.com",
      subject,
      text,
      html: `<p>Hello,</p>
      <p>Thank you for registering with our application. Please use the following verification code to activate your account:</p>
      <h2><strong>${1234}</strong></h2>
      <p>If you did not request this code, please disregard this email. Your account will not be activated.</p>
      <p>Best regards,</p>
      <p>Gym Bro LLC</p>`,
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
