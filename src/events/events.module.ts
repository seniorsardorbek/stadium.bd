  import { Module } from "@nestjs/common";
  import { EventsController, EventsGateway } from "./events.gateway";
  import { MongooseModule } from "@nestjs/mongoose";
  import { Event, EventSchema } from "./Schema/Schema";

  @Module({
    imports :[ MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])],
    controllers:[EventsController] ,
    providers: [EventsGateway],
  })
  export class EventsModule {}
