import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { EmailController } from "./mail.controller";

@Module({
  controllers: [EmailController],
  providers: [MailService],
})
export class MailModule {}
