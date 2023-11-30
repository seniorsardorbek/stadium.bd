import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Stadion, StadionSchema } from "./Schema/Schema";
import { StadionsController } from "./stadions.controller";
import { StadionsService } from "./stadions.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stadion.name, schema: StadionSchema }]),
  ],
  controllers: [StadionsController],
  providers: [StadionsService],
})
export class StadionsModule {}
