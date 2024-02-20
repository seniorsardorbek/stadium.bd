import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Stadion } from "src/stadions/Schema/Schema";

export type OwnerDocument = HydratedDocument<Owner>;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
})
export class Owner {
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
    unique: true,
  })
  callnumber: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    default: "owner",
  })
  role: string;
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);


OwnerSchema.virtual('stadiums', {
  ref: 'Stadion',
  localField: '_id',
  foreignField: 'owner',
})

OwnerSchema.set('toObject', { virtuals: true })
OwnerSchema.set('toJSON', { virtuals: true })