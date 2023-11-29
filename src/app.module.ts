import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { PassportModule } from "@nestjs/passport";
import { StadionsModule } from "./stadions/stadions.module";
import { MulterModule } from "@nestjs/platform-express";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { CommentsModule } from "./comments/comments.module";
import { BookingsModule } from "./bookings/bookings.module";
import { MailerModule } from "@nestjs-modules/mailer";
import {} from "@nestjs/platform-express";
import { MailModule } from "./mail/mail.module";
import { EventsModule } from "./events/events.module";
import { TwilioModule } from "nestjs-twilio";
import { OwnersModule } from './owners/owners.module';
import { StatisticsModule } from './statistics/statistics.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "upload"), // Adjust the path as needed
    }),

    MongooseModule.forRoot("mongodb+srv://sardorbekmusilman:Just_password03@cluster0.ysxkkxu.mongodb.net/mystadion"),
    MulterModule.register({
      dest: "./src/uploads",
    }),
    MailModule,
    PassportModule.register({ session: true }),
    TwilioModule.forRoot({
      accountSid: "ACb7080c3956547034e471cbd1887b3a60",
      authToken: "eaccd61cffe1c89417d77405ca416df1",
    }),
    StadionsModule,
    UserModule,
    AuthModule,
    CommentsModule,
    BookingsModule,
    MailModule,
    EventsModule,
    OwnersModule,
    StatisticsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
