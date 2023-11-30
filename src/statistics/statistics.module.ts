import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { Booking, BookingSchema } from "src/bookings/Schema/Schema";
import { Owner, OwnerSchema } from "src/owners/schemas/Owner";
import { User, UserSchema } from "src/user/schemas/User";
import { MonthStat, MonthStatSchema } from "./Schema/MonthStat";
import { StatisticsController } from "./statistics.controller";
import { StatisticsService } from "./statistics.service";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: MonthStat.name, schema: MonthStatSchema },
      { name: User.name, schema: UserSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Owner.name, schema: OwnerSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
