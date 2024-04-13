import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { HasRole } from "src/auth/has-roles.guard";
import { IsLoggedIn } from "src/auth/is-loggin.guard";
import { SetRoles } from "src/auth/set-roles.decorator";
import { QueryDto } from "src/shared/dto/query.dto";
import { CreateOwnerDto } from "./dto/create-owner.dto";
import { OwnersService } from "./owners.service";

@Controller("owners")
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}
  // @SetRoles("admin")
  // @UseGuards(IsLoggedIn , HasRole )
  @Post("verify/:id")
  register(@Param("id") id: string ,@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.register( id,
      createOwnerDto
    );
  }

  

  // @SetRoles("admin")
  // @UseGuards(IsLoggedIn , HasRole )
  @Get()
  findAll(@Query() query: QueryDto) {
    return this.ownersService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ownersService.findOne(id);
  }
}
