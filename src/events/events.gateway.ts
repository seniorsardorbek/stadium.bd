import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Model } from 'mongoose'
import { Server } from 'socket.io'
import { IsLoggedIn } from 'src/auth/is-loggin.guard'
import { QueryDto } from 'src/shared/dto/query.dto'
import { PaginationResponse } from 'src/shared/respone/response'
import { CustomRequest } from 'src/shared/types/types'
import { Event } from './Schema/Schema'

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: 'notifications'
})
export class EventsGateway {
  constructor (@InjectModel(Event.name) private eventModule: Model<Event>) {}
  @WebSocketServer()
  server: Server

  @SubscribeMessage('message')
  handleMessage (client: any, payload: any): string {
    return 'Hello world!'
  }

  sendMessage ({ to, message, by }) {
    this.eventModule.create({ message, toMessage: to, eventBy: by })
    this.server.emit(`newMessage-${to}`, message)
  }
}
@Controller('events')
@UsePipes(ValidationPipe)
export class EventsController {
  constructor (@InjectModel(Event.name) private eventModule: Model<Event>) {}
  @UseGuards(IsLoggedIn)
  @Get()
  async findAll (
    @Req() req: CustomRequest,
    @Query() { page, q, sort }: QueryDto
  ): Promise<PaginationResponse<Event>> {
    try {
      const { limit = 10, offset = 0 } = page || {}
      const { by = 'created_at', order = 'desc' } = sort || {}
      const { _id } = req.user
      const total = await this.eventModule
        .find({ toMessage: _id })
        .countDocuments()
      const data = await this.eventModule
        .find({ toMessage: _id })
        .sort({ [by]: order === 'desc' ? -1 : 1 })
        .limit(limit)
        .skip(limit * offset)
        .populate('eventBy', ['name'])
      return { data, limit, offset, total }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        error = new HttpException(
          error.message || "Birozdan so'ng urinib ko'ring",
          HttpStatus.CONFLICT
        )
      }
      throw error
    }
  }

  @UseGuards(IsLoggedIn)
  @Put('/:id')
  confirm (@Param('id') id: string) {
    try {
      return this.eventModule.findByIdAndUpdate(id, { viewed: true })
    } catch (error) {
      if (!(error instanceof HttpException)) {
        error = new HttpException(
          error.message || "Birozdan so'ng urinib ko'ring",
          HttpStatus.CONFLICT
        )
      }
      throw error
    }
  }
}
