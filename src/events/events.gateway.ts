import { InjectModel } from "@nestjs/mongoose";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { Event } from "./Schema/Schema";
import { Model } from "mongoose";
import { Controller, Get, Param, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CustomRequest } from "src/shared/types/types";
import { IsLoggedIn } from "src/auth/is-loggin.guard";

@WebSocketGateway({
  cors: { origin: "http://localhost:3000", credentials: true },
  namespace: "events",
})
export class EventsGateway {
  constructor(
    @InjectModel(Event.name) private eventModule: Model<Event>
  ) { }

  @WebSocketServer()
  server: Server;
  @SubscribeMessage("message")
  handleMessage(client: any, payload: any): string {
    return "Hello world!";
  }
  sendMessage({ to, message, by }) {
    this.eventModule.create({ message, toMessage: to, eventBy: by })
    this.server.emit(`newMessage-${to}`, message);
  }
  
}
@Controller('eventss')
@UsePipes(ValidationPipe)
export class EventsController {
  constructor(
    @InjectModel(Event.name) private eventModule: Model<Event>,
  ) { }
  @UseGuards(IsLoggedIn)
  @Get()
  findAll(@Req() req: CustomRequest) {
    const { _id } = req.user
    return this.eventModule.find({ toMessage: _id }).sort({created_at : -1}).populate('eventBy', ['name']);
  }

  @UseGuards(IsLoggedIn)
  @Put('/:id')
  confirm(@Param('id') id: string) {
    return this.eventModule.findByIdAndUpdate(id, { viewed: true });
  }
}