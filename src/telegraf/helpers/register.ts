import { getRandomNumber } from "src/shared/utils/utils";
import { Context } from 'nestjs-telegraf'; // Import Context directly
import { TelegrafContext } from "src/shared/types/types";

export async function register(ctx :TelegrafContext) {
    const rdm = getRandomNumber(999, 10000);
    const { phone_number, first_name, user_id } = ctx.message.contact;
    // You need to have this.userModel available in your function
    const exist = await this.userModel.findOne({ phonenumber: phone_number });
    if (exist) {
      const htmlTemplate =
        'Vayyo siz oldin ruyxatdan o\'tkan ekansiz! - Code : <span  class="tg-spoiler"> {{code}}!</span>';
      const template = Handlebars.compile(htmlTemplate);
      const renderedHtml = template({ code: rdm });
      await this.userModel.findOneAndUpdate(
        { phonenumber: phone_number },
        { verification: rdm },
      );
      ctx.replyWithHTML(renderedHtml, {
        reply_markup: { remove_keyboard: true },
      });
    } else {
      const htmlTemplate =
        'Bro, Xush Kelibsiz! - Code: <span  class="tg-spoiler"> {{code}}!</span>';
      const template = Handlebars.compile(htmlTemplate);
      const renderedHtml = template({ code: rdm });
      await this.userModel.create({
        phonenumber: phone_number,
        name: first_name,
        role: "player",
        chatId: user_id,
        verification: rdm,
      });
      ctx.replyWithHTML(renderedHtml, {
        reply_markup: { remove_keyboard: true },
      });
    }
}
