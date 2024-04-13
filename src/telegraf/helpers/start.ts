import { Context } from "telegraf";
import Handlebars from "handlebars";

export async function starter  (ctx : Context){
    const { first_name } = ctx.message.from;

    const htmlTemplate = "<b> Assalom alaykum  {{name}}!</b>";
    const template = Handlebars.compile(htmlTemplate);
    const renderedHtml = template({ name: first_name });
    await ctx.replyWithHTML(renderedHtml, {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Kontakt ulashing!",
              request_contact: true,
            },
          ],
        ],
        resize_keyboard: true,
      },
    });
}