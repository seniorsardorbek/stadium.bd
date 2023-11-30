import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { CustomRequest } from "src/shared/types/types";
import { Comment } from "./Schema/comment";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

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
      .populate("commentBy", "email name avatarka")
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
