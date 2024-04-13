import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Ctx, Help, InjectBot, On } from 'nestjs-telegraf'
import { TelegrafContext } from 'src/shared/types/types'
import { User } from 'src/user/schemas/User'
import { Context, Telegraf } from 'telegraf'
import { TelegrafService } from './telegraf.service'

@Injectable()
export class TelegrafUpdate {
  constructor (
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectBot('user') private userBot: Telegraf<Context>,
    readonly service: TelegrafService
  ) {
    this.userBot.start(async ctx => {
      return this.service.starter(ctx)
    })
    this.userBot.on('contact', ctx => {
      return this.service.register(ctx)
    })
    this.userBot.on('message', (ctx: TelegrafContext) => {
      const messsage = ctx.message.text
      if (!messsage) return
      return ctx.sendMessage('Men sizni tushunmayapman!')
    })
  }
  async sendMessage (chatId?: string, msg?: string , extra?: any ) {
    if (!chatId) return
    return this.userBot.telegram.sendMessage(chatId, msg , extra)
  }
}
