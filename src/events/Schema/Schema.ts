import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type EventDocument = HydratedDocument<Event>;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
})
export class Event {


  @Prop({
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  })
  toMessage: mongoose.Schema.Types.ObjectId; 

  @Prop({
    type: String,
    required: true,
  })
  message: mongoose.Schema.Types.String; 

  @Prop({
    type: Boolean,
    default: false,
  })
  viewed: mongoose.Schema.Types.Boolean; 

  @Prop({
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  })
  eventBy:  mongoose.Schema.Types.ObjectId;
  
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.virtual('eventUser' ,{
  ref:'User',
  localField: 'eventBy',
  foreignField: '_id',
  justOne :true
})