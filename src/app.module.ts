import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { MulterModule } from "@nestjs/platform-express";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BookingsModule } from "./bookings/bookings.module";
import { CommentsModule } from "./comments/comments.module";
import { EventsModule } from "./events/events.module";
import { MailModule } from "./mail/mail.module";
import { OwnersModule } from "./owners/owners.module";
import { StadionsModule } from "./stadions/stadions.module";
import { StatisticsModule } from "./statistics/statistics.module";
import { UserModule } from "./user/user.module";
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "upload"), // Adjust the path as needed
    }),

    MongooseModule.forRoot(
      "mongodb+srv://sardorbekmusilman:Just_password03@cluster0.ysxkkxu.mongodb.net/mystadion",
    ),
    MulterModule.register({
      dest: "./src/uploads",
    }),
    MailModule,
    PassportModule.register({ session: true }),
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
