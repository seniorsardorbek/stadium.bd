import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { timeINterface } from "src/shared/types/types";

export type BookingDocument = HydratedDocument<Booking>;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
})
export class Booking {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  })
  bookingBy: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stadion",
    required: true,
  })
  stadion: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
  })
  from: number;
  @Prop({
    type: Boolean,
    default: false,
  })
  confirmed: boolean;

  @Prop({
    type: Number,
    required: true,
  })
  callNumber: number;

  // @Prop({
  //     type: Number,
  //     required: true
  // })
  // to: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
BookingSchema.virtual("BookedBy", {
  ref: "User",
  localField: "bookingBy",
  foreignField: "_id",
  justOne: true,
});
BookingSchema.virtual("stadionInfo", {
  ref: "Stadion",
  localField: "stadion",
  foreignField: "_id",
  justOne: true,
  // populate: {
  //     path: 'owner',
  //     model: 'User',
  //   }
});
