import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { TelegrafModule } from 'nestjs-telegraf'
import { Booking, BookingSchema } from 'src/bookings/Schema/Schema'
import { Stadion, StadionSchema } from 'src/stadions/Schema/Schema'
import { TelegrafUpdate } from 'src/telegraf/telegraf.controller'
import { TelegrafService } from 'src/telegraf/telegraf.service'
import { User, UserSchema } from 'src/user/schemas/User'
import { OwnerBotUpdate } from './ownerbot.controller'
import { OwnersController } from './owners.controller'
import { OwnersService } from './owners.service'
import { Owner, OwnerSchema } from './schemas/Owner'

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: 'owner',
      imports: [ConfigModule],
      useFactory: () => ({
        token: '7030864630:AAFS3tu_hDz9ooh1fNADp1BvFtvjuymLOd8',
        include: [OwnerBotUpdate]
      })
    }),
    MongooseModule.forFeature([{ name: Owner.name, schema: OwnerSchema }]),
    MongooseModule.forFeature([{ name: Stadion.name, schema: StadionSchema }]),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [OwnersController],
  providers: [OwnersService, OwnerBotUpdate , TelegrafUpdate , TelegrafService , Owner   ]
})
export class OwnersModule {}
