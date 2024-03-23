import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EventsGateway } from "src/events/events.gateway";
import { Event, EventSchema } from "src/events/Schema/Schema";
import { Stadion, StadionSchema } from "src/stadions/Schema/Schema";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";
import { Booking, BookingSchema } from "./Schema/Schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: Stadion.name, schema: StadionSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService, EventsGateway],
})
export class BookingsModule {}
