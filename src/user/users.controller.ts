import {
  Controller,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
  Body,
  Get,
  Post,
  Patch,
  UsePipes,
  Res,
  Delete,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common/decorators";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryDto } from "./dto/query.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SetRoles } from "src/auth/set-roles.decorator";
import { IsLoggedIn } from "src/auth/is-loggin.guard";
import { Response } from "express";
import { HasRole } from "src/auth/has-roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/shared/multer.options";
@Controller("users")
@UsePipes(ValidationPipe)
export class UsersController {
  constructor(private readonly userService: UserService) {}
  // @SetRoles("admin")
  // @UseGuards(IsLoggedIn )
  @Get()
  findAll(@Query() query: QueryDto) {
    return this.userService.list(query);
  }
  @Get("exe")
  async exportToExcel(@Res() res: Response) {
    return this.userService.exe(res);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.show(id);
  }
  
  @UseInterceptors(FileInterceptor('avatarka', multerOptions))
  @Post()
  postUser(@Body() data: CreateUserDto ,   @UploadedFile() avatarka: Express.Multer.File) {
    console.log(avatarka);
    return this.userService.create(data , avatarka );
  }



  @Patch(":id")
  updateUser(@Param("id") id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Delete(":id")
  deleteUser(@Param("id") id: string) {
    
    return this.userService.delete(id);
  }
}
