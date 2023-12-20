import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TelegrefController } from './telegraf.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/User';
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),],
  providers :[TelegrefController]
})
export class TelegrafModulee { }
