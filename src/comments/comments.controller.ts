import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import mongoose from "mongoose";
import { IsLoggedIn } from "src/auth/is-loggin.guard";
import { CustomRequest } from "src/shared/types/types";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(IsLoggedIn)
  @Post(":id")
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param("id") id: mongoose.Schema.Types.ObjectId,
    @Req() req: CustomRequest,
  ) {
    return this.commentsService.create(createCommentDto, id, req);
  }

  @Get(":id")
  findAll(@Param("id") id: mongoose.ObjectId) {
    return this.commentsService.findAll(id);
  }

  @Delete(":id")
  remove(@Param("id") id: mongoose.ObjectId) {
    return this.commentsService.remove(id);
  }
}
