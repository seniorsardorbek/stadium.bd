import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import config from "src/shared/config";
import { User, UserSchema } from "src/user/schemas/User";
import { GoogleStragery } from "./utils/Google.stragery";
import { SessionSerializer } from "./utils/Serializer";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: config.jwt.secret,
      signOptions: { expiresIn: "72h" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    SessionSerializer,
    GoogleStragery,
    {
      provide: "AUTH_SERVICE",
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
