import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserRole } from "src/shared/enum";

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
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_deleted: boolean;

  @Prop({
    type: String,
    enum: UserRole,
    default: "player",
    required: true,
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
