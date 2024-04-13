import { Injectable } from '@nestjs/common'
import { Context } from 'telegraf'
import Handlebars from 'handlebars'
import { InjectModel } from '@nestjs/mongoose'
import { User } from 'src/user/schemas/User'
import { Model } from 'mongoose'
import { getRandomNumber } from 'src/shared/utils/utils'
import { TelegrafContext } from 'src/shared/types/types'

export class TelegrafService {
  constructor (@InjectModel(User.name) private userModel: Model<User>) {}
  async starter (ctx: Context) {
    const { first_name } = ctx.message.from
    const htmlTemplate = '<b> Assalom alaykum  {{name}}!</b>'
    const template = Handlebars.compile(htmlTemplate)
    const renderedHtml = template({ name: first_name })
    await ctx.replyWithHTML(renderedHtml, {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Kontaktni xavfsiz ulashish',
              request_contact: true
            }
          ]
        ],
        resize_keyboard: true
      }
    })
  }
  async register (ctx: TelegrafContext) {
    try {
      const rdm = getRandomNumber(999, 10000)
      const { phone_number, first_name, user_id: chatId , username} = ctx.message.contact

      const exist = await this.userModel.findOne({ chatId })
      if (exist) {
        const htmlTemplate =
          'Vayyo siz oldin ruyxatdan o\'tkan ekansiz! - Code : <span  class="tg-spoiler"> {{code}}!</span>'
        const template = Handlebars.compile(htmlTemplate)
        const renderedHtml = template({ code: rdm })
        await this.userModel.findOneAndUpdate(
          { phonenumber: phone_number },
          { verification: rdm }
        )
        ctx.replyWithHTML(renderedHtml, {
          reply_markup: { remove_keyboard: true }
        })
      } else {
        const htmlTemplate =
          'Bro, Xush Kelibsiz! - Code: <span  class="tg-spoiler"> {{code}}!</span>'
        const template = Handlebars.compile(htmlTemplate)
        const renderedHtml = template({ code: rdm })
        await this.userModel.create({
          phonenumber: phone_number,
          name: first_name,
          role: 'player',
          action :'menu' ,
          chatId: chatId,
          verification: rdm ,username 
        })
        ctx.replyWithHTML(renderedHtml, {
          reply_markup: { remove_keyboard: true }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
