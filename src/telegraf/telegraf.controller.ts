import { BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Handlebars from 'handlebars';
import { Model } from 'mongoose';
import {
  Ctx,
  Hears,
  Help,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { TelegrafContext } from 'src/shared/types/types';
import { getRandomNumber } from 'src/shared/utils/utils';
import { User } from 'src/user/schemas/User';

@Update()
export class TelegrefController {
  constructor(@InjectModel(User.name) private userModel: Model<User>,) { }
  @Start()
  async start(@Ctx() ctx: TelegrafContext) {
    console.log();
    const {first_name} = ctx.message.from

    const htmlTemplate = '<b>Ey, Assalom alaykum  {{name}}!</b>';
    const template = Handlebars.compile(htmlTemplate);
    const renderedHtml = template({ name: first_name });
    await ctx.replyWithHTML(renderedHtml, {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Kontakt ulashamiz!',
              request_contact: true
            },
          ],
        ],
        resize_keyboard: true,
      },
    })
  }

  @Help()
  async help(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('Send me a sticker');
  }

  @On('contact')
  async on(@Ctx() ctx: TelegrafContext) {
    const rdm = getRandomNumber(999, 10000)
    const { phone_number, first_name, user_id } = ctx.message.contact
    const exist = await this.userModel.findOne({ phonenumber: phone_number })
    if (exist) {
      
      const htmlTemplate ='Vayyo siz oldin ruyxatdan o\'tkan ekansiz! - Code : <span  class="tg-spoiler"> {{code}}!</span>';
      const template = Handlebars.compile(htmlTemplate);
      const renderedHtml = template({ code: rdm });
      await this.userModel.findOneAndUpdate({ phonenumber: phone_number }, { verification: rdm })
      ctx.replyWithHTML( renderedHtml, {
        reply_markup: { remove_keyboard: true },
      });
    } else {
      const htmlTemplate ='Bro, Xush Kelibsiz! - Code: <span  class="tg-spoiler"> {{code}}!</span>';
      const template = Handlebars.compile(htmlTemplate);
      const renderedHtml = template({ code: rdm });
      await this.userModel.create({ phonenumber: phone_number, name: first_name, role: "player", chatId: user_id, verification: rdm })
      ctx.replyWithHTML( renderedHtml, {
        reply_markup: { remove_keyboard: true },
      });
    }
  }


  @On('photo')
  async onn(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('Iyaaa, rasmni siz tashladizmi?');
  }

  @On('text')
  async hears(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('Bekorchilikni bas qiling!');
  }
}