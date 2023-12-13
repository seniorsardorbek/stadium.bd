import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import config from "src/shared/config";

@Injectable()
export class MailService {
  private transporter;
  constructor() {
    console.log(config);
    this.transporter = nodemailer.createTransport({
      host: config.transporter.host,
      port: config.transporter.port,
      secure: false,
      auth: {
        user: config.transporter.auth.user,
        pass: config.transporter.auth.pass,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string , html : string) {
    const mailOptions = {
      from: config.transporter.auth.user, 
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
