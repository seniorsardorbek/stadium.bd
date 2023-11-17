import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto, LoginOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { QueryDto } from 'src/shared/dto/query.dto';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post('register')
  register(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.register(createOwnerDto);
  }
  @Post('login')
  login(@Body() createOwnerDto: LoginOwnerDto) {
    return this.ownersService.login(createOwnerDto);
  }

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.ownersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ownersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    return this.ownersService.update(id, updateOwnerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ownersService.remove(id);
  }
}
