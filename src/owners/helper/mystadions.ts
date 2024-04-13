import { FlattenMaps, Model, ObjectId } from "mongoose"
import { TelegrafContext } from "src/shared/types/types"
import { Stadion } from "src/stadions/Schema/Schema"
import { User } from "src/user/schemas/User"
import { Owner } from "../schemas/Owner";

export  async function mystadions(stadionModel :Model<Stadion>, exist  :FlattenMaps<Owner> & {
    _id: ObjectId;
} , msg : TelegrafContext){
    const stadions = await stadionModel
          .find({
            owner: exist._id
          })
          .lean()
        const keyboards = stadions.map(stadion => ({
          text: stadion.destination,
          callback_data: `mystadions_${stadion._id}`
        }))
        msg.sendMessage('Stadionlar ruyxati', {
          reply_markup: {
            inline_keyboard: [keyboards]
          }
        })
}