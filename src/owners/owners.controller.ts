import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto, LoginOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { SetRoles } from 'src/auth/set-roles.decorator';
import { IsLoggedIn } from 'src/auth/is-loggin.guard';
import { HasRole } from 'src/auth/has-roles.guard';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}
  @SetRoles("admin")
  @UseGuards(IsLoggedIn , HasRole )
  @Post('register')
  register(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.register(createOwnerDto);
  }


  @Post('login')
  login(@Body() createOwnerDto: LoginOwnerDto) {
    return this.ownersService.login(createOwnerDto);
  }
  
  @SetRoles("admin")
  @UseGuards(IsLoggedIn , HasRole )
  @Get()
  findAll(@Query() query: QueryDto) {
    return this.ownersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ownersService.findOne(id);
  }
  
  @SetRoles("admin")
  @UseGuards(IsLoggedIn , HasRole )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    return this.ownersService.update(id, updateOwnerDto);
  }
  
  @SetRoles("admin")
  @UseGuards(IsLoggedIn , HasRole )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ownersService.remove(id);
  }
}
