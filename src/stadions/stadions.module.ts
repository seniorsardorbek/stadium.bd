import { Module } from "@nestjs/common";
import { StadionsService } from "./stadions.service";
import { StadionsController } from "./stadions.controller";
import { Stadion, StadionSchema } from "./Schema/Schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stadion.name, schema: StadionSchema }]),
  ],
  controllers: [StadionsController],
  providers: [StadionsService ],
})
export class StadionsModule {}
