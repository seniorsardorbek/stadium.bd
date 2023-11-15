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
  Put,
  UsePipes,
  Res,
} from "@nestjs/common/decorators";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryDto } from "./dto/query.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SetRoles } from "src/auth/set-roles.decorator";
import { IsLoggedIn } from "src/auth/is-loggin.guard";
import { Response } from "express";
import { HasRole } from "src/auth/has-roles.guard";
@Controller("users")
@UsePipes(ValidationPipe)
export class UsersController {
  constructor(private readonly userService: UserService) {}
  @SetRoles("admin")
  @UseGuards(IsLoggedIn , HasRole)
  @Get()
  findAll(@Query() query: QueryDto) {
    return this.userService.list(query);
  }
  @Get("exellle")
  async exportToExcel(@Res() res: Response) {
    return this.userService.exelle(res);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.show(id);
  }

  @Post()
  postUser(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }
  @Post("admin")
  postAdmin(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Patch(":id")
  updateUser(@Param("id") id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }
  @Put(":id")
  deleteUser(@Param("id") id: string) {
    return this.userService.delete(id);
  }
}
