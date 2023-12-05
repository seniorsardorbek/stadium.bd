import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/schemas/User";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import config from "src/shared/config";
import { MailService } from "src/mail/mail.service";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: config.jwt.secret,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService , MailService],
})
export class AuthModule {}
