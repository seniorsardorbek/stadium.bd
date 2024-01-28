import {
  Controller,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import {
  Delete,
  Get,
  Req,
  Res,
  UsePipes
} from "@nestjs/common/decorators";
import { Response } from "express";
import { HasRole } from "src/auth/has-roles.guard";
import { IsLoggedIn } from "src/auth/is-loggin.guard";
import { SetRoles } from "src/auth/set-roles.decorator";
import { CustomRequest } from "src/shared/types/types";
import { QueryDto } from "./dto/query.dto";
import { UserService } from "./user.service";
@Controller("users")
@UsePipes(ValidationPipe)
export class UsersController {
  constructor(private readonly userService: UserService) {}
  // @SetRoles("admin")
  // @UseGuards(IsLoggedIn, HasRole)
  @Get()
  findAll(@Query() query: QueryDto) {
    return this.userService.list(query);
  }


  // @SetRoles("admin")
  // @UseGuards(IsLoggedIn, HasRole)
  @Get("inxlsx")
  async exportToExcel(@Res() res: Response) {
    return this.userService.exe(res);
  }
  // @SetRoles("admin")
  // @UseGuards(IsLoggedIn, HasRole)
  @Get("amonth")
  async aMonthAddedUsers() {
    return this.userService.aMonthUsers();
  }

  @UseGuards(IsLoggedIn)
  @Get("/me")
  findme(@Req() req: CustomRequest) {
    return this.userService.showme(req);
  }

  // @SetRoles("admin")
  // @UseGuards(IsLoggedIn, HasRole)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.show(id);
  }


  @UseGuards(IsLoggedIn)
  @Delete(":id")
  deleteUser(@Param("id") id: string) {
    return this.userService.delete(id);
  }
}
