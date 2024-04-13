import { Model } from 'mongoose'
import { Booking } from 'src/bookings/Schema/Schema'
import { TelegrafContext } from 'src/shared/types/types'
import { formatDateWithMonthNames } from 'src/shared/utils/utils'
export async function lastgames (
  msg: TelegrafContext,
  exist: any,
  stadionModel,
  bookingModel: Model<Booking>,
  limit: number,
  offset: number
) {
  const stadions = await stadionModel
    .find({
      owner: exist._id
    })
    .lean()
  const stadiums = stadions.map(stadium => stadium._id)
  const total = await bookingModel.find({ stadion: { $in: stadiums } }).count()
  const bookings: any[] = await bookingModel
    .find({ stadion: { $in: stadiums } })
    .populate('bookingBy stadion')
    .skip(limit * offset)
    .limit(limit)
    .sort({ created_at: -1 })
    .lean()

  const lastgamesInlineKeyboards = bookings.map((booking, i) => [
    {
      text: `${limit * offset + i + 1}) ${booking.bookingBy?.phonenumber}  ${formatDateWithMonthNames(booking.from)} ${
        booking.status === 'pending'
          ? '⏳'
          : booking.status === 'confirmed'
          ? '✅'
          : '❌'
      } ${
        booking.stadion?.destination.slice(0, 10)
      } ${
       booking.bookingBy?.name
      } ${formatDateWithMonthNames(new Date(booking.created_at).getTime())}`,
      callback_data: `action_${booking._id}`
    }
  ])
  const paginationKeyboard = [
    {
      text: '⏮️',
      callback_data: offset > 0 ? `games_${offset - 1}` : 'overpage'
    },
    {
      text: '✖️',
      callback_data:
        offset > 0
          ? `games_${offset - 1}`
          : `delete_${msg?.message?.message_id}`
    },
    {
      text: '⏭️',
      callback_data:
        Math.round(total / limit) > offset
          ? `games_${offset + 1}`
          : 'overpage'
    }
  ]
  if (!msg?.message?.text) {
    return msg.editMessageReplyMarkup({
      inline_keyboard: [
        ...lastgamesInlineKeyboards,
       paginationKeyboard
      ] ,
      
    })
  }
  // await msg.deleteMessage(msg?.callbackQuery?.message?.message_id)
  await msg.sendMessage('Oyinlar', {
    reply_markup: {
      inline_keyboard: [
        ...lastgamesInlineKeyboards,
        paginationKeyboard
      ]
    }
  })
}
