  import { Module } from "@nestjs/common";
  import { EventsController, EventsGateway } from "./events.gateway";
  import { MongooseModule } from "@nestjs/mongoose";
  import { Event, EventSchema } from "./Schema/Schema";
import { TwilioModule } from "nestjs-twilio";

  @Module({
    imports :[ MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]), TwilioModule.forRoot({
      accountSid: "ACb7080c3956547034e471cbd1887b3a60",
      authToken: "eaccd61cffe1c89417d77405ca416df1",
    }),],
    controllers:[EventsController] ,
    providers: [EventsGateway],
  })
  export class EventsModule {}
