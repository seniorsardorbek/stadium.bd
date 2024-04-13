import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FlattenMaps, Model, ObjectId } from 'mongoose'
import { InjectBot } from 'nestjs-telegraf'
import { Booking } from 'src/bookings/Schema/Schema'
import { TelegrafContext } from 'src/shared/types/types'
import { Stadion } from 'src/stadions/Schema/Schema'
import { Telegraf } from 'telegraf'
import { lastgames } from './helper/lastgames'
import { mystadions } from './helper/mystadions'
import { Owner } from './schemas/Owner'
import { formatDateWithMonthNames } from 'src/shared/utils/utils'
import { TelegrafUpdate } from 'src/telegraf/telegraf.controller'
import { MENU } from '../shared/keyboards'

@Injectable()
export class OwnerBotUpdate {
  constructor (
    @InjectModel(Owner.name) private ownerModel: Model<Owner>,
    @InjectModel(Stadion.name) private stadionModel: Model<Stadion>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectBot('owner') private ownerBot: Telegraf<TelegrafContext>,
    private userBotUpdate: TelegrafUpdate
  ) {
    this.ownerBot.start(async (msg: TelegrafContext) => {
      const chatId = msg.message.from.id
      const exist = await this.ownerModel.findOne({ chatId }).lean()

      if (!exist) {
        const { first_name: name, username = null } = msg.message.from
        this.ownerModel.create({
          name,
          chatId,
          action: 'request_contact',
          username
        })
        return msg.sendMessage('Kontaktni xavfsiz ulashing', {
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
      if (exist?.action === 'request_contact') {
        return msg.sendMessage('Kontaktni xavfsiz ulashing', {
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

      if (!exist.isVerified) {
        return msg.sendMessage('Sizni hali admin tasdiqlamadi, Iltimos kuting!')
      }

      return msg.sendMessage(
        "Assalom alaykum qayta ko'rib turganimizdan xursandmiz! 😊",
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Barcha o'yinlar"
                },
                {
                  text: 'Mening stadionlarim'
                }
              ]
            ],
            resize_keyboard: true
          }
        }
      )
    })
    
    this.ownerBot.on("contact" , async(msg) =>{
      const chatId = msg?.message?.chat?.id
      const contact  = msg.message?.contact
      const exist : FlattenMaps<Owner> & { _id: ObjectId }  = await this.ownerModel.findOne({chatId})
      if (exist?.action === 'request_contact') {
        const phone = contact?.phone_number
        await this.ownerModel.findByIdAndUpdate(
          exist._id,
          { action: 'menu', phone },
          { new: true }
        )
        return msg.sendMessage("Ruyxatdan o'tdingiz", {
          reply_markup: {
            keyboard: [
              [
                {
                  text: 'Menu'
                }
              ]
            ],
            resize_keyboard: true
          }
        })
      }
      

    })

    this.ownerBot.on('message', async (msg: TelegrafContext) => {
      const message = msg.message?.text
      if (!message) return
      const chatId = msg.message?.from?.id
      const exist: FlattenMaps<Owner> & { _id: ObjectId } =
        await this.ownerModel.findOne({ chatId })
      if (!exist.isVerified) {
        return msg.sendMessage('Sizda hali grand mavjud emas!')
      }
     
      if (message === 'Menu') {
        return msg.sendMessage('Sizni jamoadasiz. Tabriklaymiz', {
          reply_markup: {
            ...MENU
          }
        })
      }
      if (message === "Barcha o'yinlar") {
        return lastgames(msg, exist, this.stadionModel, this.bookingModel, 5, 0)
      }
      if (message === 'Mening stadionlarim') {
        return mystadions(this.stadionModel, exist, msg)
      }
      return msg.sendMessage('Men sizni tushunmayapman!')
    })

    this.ownerBot.on('callback_query', async (msg: TelegrafContext) => {
      const chatId = msg.callbackQuery.from.id
      const exist = await this.ownerModel
        .findOne({ chatId, isVerified: true })
        .lean()
      const query = msg?.callbackQuery?.data

      if (query.split('_')[0] === 'games') {
        const page = +query.split('_')[1]
        return lastgames(
          msg,
          exist,
          this.stadionModel,
          this.bookingModel,
          5,
          page
        )
      }
      if (['confirmed', 'pending', 'rejected'].includes(query.split('_')[0])) {
        const bookingId = query.split('_')[1]
        const updated: any = await this.bookingModel
          .findByIdAndUpdate(
            bookingId,
            {
              status: query.split('_')[0]
            },
            { new: true }
          )
          .populate([{ path: 'bookingBy' }, { path: 'stadion' }])
        const tempMessage = `O'yin  ${
          updated.status === 'pending'
            ? 'Kutilmoqda ⏳'
            : updated.status === 'confirmed'
            ? 'Tasdiqlandi ✅'
            : 'Rad qilindi ❌'
        } 
${updated.stadion?.destination?.slice(0, 10)}       ${formatDateWithMonthNames(
          updated.from
        )}
${updated.bookingBy?.name}  ${updated.bookingBy?.phonenumber}
${formatDateWithMonthNames(new Date(updated.created_at).getTime())}`
        const pinned = await msg.sendMessage(tempMessage)
        await msg.deleteMessage(msg?.message?.messageId)
        await this.userBotUpdate.sendMessage(
          updated.bookingBy?.chatId,
          tempMessage
        )
        if (updated.status === 'confirmed') {
          msg.pinChatMessage(pinned.message_id)
        }
      }

      if (query.split('_')[0] === 'action') {
        const bookingId = query.split('_')[1]
        const booking: any = await this.bookingModel
          .findById(bookingId)
          .populate([{ path: 'bookingBy' }, { path: 'stadion' }])
        return msg.sendMessage(
          `${booking.stadion?.destination}       ${formatDateWithMonthNames(
            booking.from
          )}
${booking.bookingBy?.name}  ${booking.bookingBy?.phonenumber}
${
  booking.status === 'pending'
    ? '⏳'
    : booking.status === 'confirmed'
    ? '✅'
    : '❌'
} ${formatDateWithMonthNames(new Date(booking.created_at).getTime())}`,
          {
            reply_markup: {
              inline_keyboard: [
                booking.status === 'rejected'
                  ? [
                      {
                        text: '⌛',
                        callback_data: `pending_${booking._id}`
                      },
                      {
                        text: '✅',
                        callback_data: `confirmed_${booking._id}`
                      }
                    ]
                  : booking.status === 'pending'
                  ? [
                      {
                        text: '❌',
                        callback_data: `rejected_${booking._id}`
                      },
                      {
                        text: '✅',
                        callback_data: `confirmed_${booking._id}`
                      }
                    ]
                  : booking.status === 'confirmed'
                  ? [
                      {
                        text: '❌',
                        callback_data: `rejected_${booking._id}`
                      },
                      {
                        text: '⌛',
                        callback_data: `pending_${booking._id}`
                      }
                    ]
                  : []
              ]
            }
          }
        )
      }
      if (query === 'overpage') {
        return
      }
    })
  
  }
  async sendMessage (chatId: string, msg: string, extra?: any) {
    return this.ownerBot.telegram.sendMessage(chatId, msg, extra)
  }
}
