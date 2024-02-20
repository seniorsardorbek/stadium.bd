import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from "@nestjs/platform-express";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BookingsModule } from "./bookings/bookings.module";
import { CommentsModule } from "./comments/comments.module";
import { EventsModule } from "./events/events.module";
import { OwnersModule } from "./owners/owners.module";
import { StadionsModule } from "./stadions/stadions.module";
import { StatisticsModule } from "./statistics/statistics.module";
import { UserModule } from "./user/user.module";
import { TelegrafModulee } from "./telegraf/telegraf.module";
import config from "./shared/config";
import { TelegrafModule } from "nestjs-telegraf";
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "upload"),
    }),
    MongooseModule.forRoot(
      `${config.db.host}/${config.db.name}`,
    ),
    MulterModule.register({
      dest: "./uploads",
    }),
    TelegrafModule.forRoot({
      token: "6831641712:AAECquuFPVUsc2wzmI5ClEc09nOfyX803Dc",
      include: [],
    }),
    StadionsModule,
    UserModule,
    TelegrafModulee,
    AuthModule,
    CommentsModule,
    BookingsModule,
    EventsModule,
    OwnersModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
