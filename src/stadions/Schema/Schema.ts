import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type StadionDocument = HydratedDocument<Stadion>;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
})
export class Stadion {
  @Prop({
    type: [String], // Change the type to an array of strings
    required: true,
  })
  images: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId, // Specify the type as mongoose.Schema.Types.ObjectId
    ref: "Owner",
    required: true,
  })
  owner: mongoose.Schema.Types.ObjectId; // Change the type to mongoose.Schema.Types.ObjectId

  @Prop({
    type: Number,
    default: 2,
  })
  rate: number;

  @Prop({
    type: String,
    required: true,
  })
  description: string; // Change the type to lowercase "string"

  @Prop({
    type: String,
    required: true,
  })
  callnumber: string;
  @Prop({
    type: Number,
    required: true,
  })
  cost: number;
  @Prop({
    type: String,
    required: true,
  })
  destination: string;

  @Prop({
    type: Object,
    required: true,
  })
  size: Object;
  @Prop({
    type: Number,
    required: true,
  })
  lat: number;
  @Prop({
    type: Number,
    required: true,
  })
  year: number;
  @Prop({
    type: Number,
    required: true,
  })
  lng: number;
  @Prop({
    type: Object,
  })
  loc: {
    type: {
      type: string;
      enum: ["Point"];
      default: "Point"; // GeoJSON point type
    };
    coordinates: {
      type: [number]; // An array of numbers for latitude and longitude
      required: true;
      index: "2dsphere"; // Use a 2dsphere index for geospatial queries
    };
  };
  title: any;
}

export const StadionSchema = SchemaFactory.createForClass(Stadion);
StadionSchema.index({ loc: "2dsphere" });

StadionSchema.virtual("ownerInfo", {
  ref: "Owner",
  localField: "owner",
  foreignField: "_id",
  justOne: true,
});
