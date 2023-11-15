import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<Comment>;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
})
export class Comment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId, // Specify the type as mongoose.Schema.Types.ObjectId
    ref: "User",
    required: true,
  })
  commentBy: mongoose.Schema.Types.ObjectId; // Change the type to mongoose.Schema.Types.ObjectId

  @Prop({
    type: mongoose.Schema.Types.ObjectId, // Specify the type as mongoose.Schema.Types.ObjectId
    ref: "Stadion",
    required: true,
  })
  post: mongoose.Schema.Types.ObjectId; // Change the type to mongoose.Schema.Types.ObjectId

  @Prop({
    type: String,
    required: true,
  })
  comment: string; // Change the type to lowercase "string"
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.virtual("Commentby", {
  ref: "User",
  localField: "commentBy",
  foreignField: "_id",
  justOne: true,
});
