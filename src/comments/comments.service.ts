import { Injectable } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment } from "./Schema/comment";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { log } from "console";
import { CustomRequest, UserDetails } from "src/shared/types/types";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}
  create(
    createCommentDto: CreateCommentDto,
    id: mongoose.Schema.Types.ObjectId,
    req: CustomRequest,
  ) {
    return this.commentModel.create({
      ...createCommentDto,
      post: id,
      commentBy: req.user._id,
    });
  }

  findAll(id: mongoose.ObjectId) {
    return this.commentModel
      .find({ post: id })
      .populate("commentBy", "email name")
      .sort({ created_at: -1 });
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: mongoose.ObjectId) {
    return this.commentModel.deleteOne(id);
  }
}
