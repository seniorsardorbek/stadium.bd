import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
})
export class User {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    unique: true
  })
  phonenumber: string;
  @Prop({
    type: Number,
    required: true,
    unique: true
  })
  verification: number;

  @Prop({
    type: Number,
    required: true
  })
  chatId: number;

  @Prop({
    type: String,
    default: "player",
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
