import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { MonthStat, MonthStatSchema } from './Schema/MonthStat';
import { User, UserSchema } from 'src/user/schemas/User';
import { Booking, BookingSchema } from 'src/bookings/Schema/Schema';
import { Owner, OwnerSchema } from 'src/owners/schemas/Owner';

@Module({
  imports: [ScheduleModule.forRoot(),
  MongooseModule.forFeature([{ name: MonthStat.name, schema: MonthStatSchema },
  { name: User.name, schema: UserSchema },
  { name: Booking.name, schema: BookingSchema },
  { name: Owner.name, schema: OwnerSchema },
]
  ),

  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule { }
