import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { HasRole } from "src/auth/has-roles.guard";
import { IsLoggedIn } from "src/auth/is-loggin.guard";
import { SetRoles } from "src/auth/set-roles.decorator";
import { multerOptions } from "src/shared/multer.options";
import { QueryDto } from "./dto/query.stadium.dto";
import { StadionsService } from "./stadions.service";
import { CustomRequest } from "src/shared/types/types";
import { CreateStadionDto } from "./dto/create-stadion.dto";

@Controller("stadions")
export class StadionsController {
  constructor(private readonly stadionsService: StadionsService) {}

  // @SetRoles("admin")
  // @UseGuards(IsLoggedIn , HasRole )
  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(FilesInterceptor("images", 10, multerOptions))
  create(
    @Req() req : CustomRequest ,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() data : CreateStadionDto,
  ) {
    return this.stadionsService.create(data, images );
  }

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.stadionsService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.stadionsService.findOne(id);
  }
  @SetRoles("admin")
  @UseGuards(IsLoggedIn, HasRole)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.stadionsService.remove(id);
  }
}
