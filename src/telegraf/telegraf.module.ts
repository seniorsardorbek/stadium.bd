import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TelegrafUpdate } from './telegraf.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/user/schemas/User'
import { TelegrafService } from './telegraf.service'
import { TelegrafModule } from 'nestjs-telegraf'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from 'src/user/user.module'
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: 'user',
      imports: [ConfigModule],
      useFactory: () => ({
        token: '6831641712:AAECquuFPVUsc2wzmI5ClEc09nOfyX803Dc',
        include: [TelegrafUpdate]
      })
    }),

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [TelegrafService, TelegrafUpdate] ,
  exports :[TelegrafUpdate]
})
export class TelegrafModulee {}
