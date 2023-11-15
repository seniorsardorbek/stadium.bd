import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  Query,
  UseGuards,
} from "@nestjs/common";
import { StadionsService } from "./stadions.service";
import { CreateStadionDto } from "./dto/create-stadion.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { IsLoggedIn } from "src/auth/is-loggin.guard";
import { QueryDto } from "./dto/query.stadium.dto";

@Controller("stadions")
export class StadionsController {
  constructor(private readonly stadionsService: StadionsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const originalname = file.originalname;
          const extension = originalname.split(".").pop();
          const customFilename = `${uniqueSuffix}.${extension}`;
          callback(null, customFilename);
        },
      }),
    }),
  )
  create(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() createStadionDto: CreateStadionDto,
  ) {
    return this.stadionsService.create(createStadionDto, images);
  }
  @Get()
  findAll(@Query() query: QueryDto) {
    return this.stadionsService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.stadionsService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.stadionsService.remove(id);
  }
}
