import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

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
    validate: {
      validator: function (value) {
        return /^\+998(90|91|93|94|95|97|98|99|50|55|88|77|33|20)[0-9]{7}$/.test(
          value,
        );
      },
      message: "Invalid phone number format",
    },
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
