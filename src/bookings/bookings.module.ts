import { Module } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { BookingsController } from "./bookings.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Booking, BookingSchema } from "./Schema/Schema";
import { EventsGateway } from "src/events/events.gateway";
import { Stadion, StadionSchema } from "src/stadions/Schema/Schema";
import { Event, EventSchema } from "src/events/Schema/Schema";
import { TwilioModule } from "nestjs-twilio";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: Stadion.name, schema: StadionSchema }]),
    TwilioModule.forRoot({
      accountSid: "ACb7080c3956547034e471cbd1887b3a60",
      authToken: "eaccd61cffe1c89417d77405ca416df1",
    }),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService, EventsGateway],
})
export class BookingsModule {}
