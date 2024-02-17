import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { HasRole } from "src/auth/has-roles.guard";
import { IsLoggedIn } from "src/auth/is-loggin.guard";
import { SetRoles } from "src/auth/set-roles.decorator";
import { CustomRequest } from "src/shared/types/types";
import * as bookingsService_1 from "./bookings.service";
import { CreateBookingDto, StatusBookingDto } from "./dto/create-booking.dto";
import { QueryDto } from "src/shared/dto/query.dto";
@Controller("bookings")
@UsePipes(ValidationPipe)
export class BookingsController {
  constructor(
    private readonly bookingsService: bookingsService_1.BookingsService,
  ) {}

  @UseGuards(IsLoggedIn)
  @Post()
  async create(@Body() data: CreateBookingDto, @Req() req: CustomRequest) {
    const newBooking = await this.bookingsService.create(data, req);
    return newBooking;
  }

  @UseGuards(IsLoggedIn)
  @Get('booking/me')
  findOnePersonBookings(@Req() req: CustomRequest) {
    return this.bookingsService.findOnePersonBookings(req);
  }
  @Get('')
  findAll(@Query() query: QueryDto) {
    return this.bookingsService.findAll(query);
  }

  @Get(":id")
  findOneStadions(@Param("id") id: string) {
    return this.bookingsService.findOneStadions(id);
  }

  @SetRoles("owner" , "admin")
  @UseGuards(IsLoggedIn, HasRole)
  @Put(":id")
  confirmed(
    @Req() req: CustomRequest,
    @Param("id") id: string,
    @Body() data : StatusBookingDto,
  ) {
    return this.bookingsService.confirmed(req, id, data);
  }
  @UseGuards(IsLoggedIn)
  @Delete("one/:id")
  removeMyBooking(@Param("id") id: string, @Req() req: CustomRequest) {
    return this.bookingsService.removeMyBooking(id, req);
  }
}
