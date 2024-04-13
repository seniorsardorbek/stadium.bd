import { Module } from '@nestjs/common'
import { OwnersService } from './owners.service'
import { OwnersController } from './owners.controller'
import { Owner, OwnerSchema } from './schemas/Owner'
import { MongooseModule } from '@nestjs/mongoose'
import { TelegrafModule } from 'nestjs-telegraf'
import { OwnerBotUpdate } from './ownerbot.controller'
import { ConfigModule } from '@nestjs/config'
import { Stadion, StadionSchema } from 'src/stadions/Schema/Schema'
import { Booking, BookingSchema } from 'src/bookings/Schema/Schema'
import { TelegrafUpdate } from 'src/telegraf/telegraf.controller'
import { User, UserSchema } from 'src/user/schemas/User'
import { UserModule } from 'src/user/user.module'
import { TelegrafModulee } from 'src/telegraf/telegraf.module'
import { Model } from 'mongoose'
import { TelegrafService } from 'src/telegraf/telegraf.service'

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
