import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MonthStatDocument = HydratedDocument<MonthStat>;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
})
export class MonthStat {
  @Prop({
    type: Number,
    required: true,
  })
  count: number;

  @Prop({
    type: String,
    required: true,
  })
  field: string;
}

export const MonthStatSchema = SchemaFactory.createForClass(MonthStat);

