import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EventsGateway } from 'src/events/events.gateway'
import { QueryDto } from 'src/shared/dto/query.dto'
import { PaginationResponse } from 'src/shared/respone/response'
import { CustomRequest } from 'src/shared/types/types'
import { formatDateWithMonthNames } from 'src/shared/utils/utils'
import { Stadion } from 'src/stadions/Schema/Schema'
import { Booking } from './Schema/Schema'
import { CreateBookingDto, StatusBookingDto } from './dto/create-booking.dto'

@Injectable()
export class BookingsService {
  constructor (
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Stadion.name) private stadionModel: Model<Stadion>,
    private socketService: EventsGateway
  ) {}
  async create (data: CreateBookingDto, req: CustomRequest) {
    try {
      const { _id } = req.user
      const isBooked = await this.bookingModel.findOne({
        stadion: data.stadion,
        from: data.from,
        status: 'confirmed'
      })
      if (isBooked) {
        throw new BadRequestException({
          msg: 'Bu vaqtda stadion bron qilingan!'
        })
      }
      const isUserRequested = await this.bookingModel.findOne({
        stadion: data.stadion,
        from: data.from,
        bookingBy: _id
      })
      const { owner } = await this.stadionModel.findById(data.stadion)
      if (isUserRequested) {
        throw new BadRequestException({
          msg: 'Iltimos kuting..!'
        })
      }
      await this.bookingModel.create({ ...data, bookingBy: _id })
      this.socketService.sendMessage({
        to: owner,
        message: 'Sizning stadioningiz  bron qilindi',
        by: _id
      })
      return { msg: 'Muvaffaqqiyatli bron qilindi!' }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        error = new HttpException(
          error.message || "Birozdan so'ng urinib ko'ring",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
      throw error
    }
  }

  async findAll ({
    page,
    sort
  }: QueryDto): Promise<PaginationResponse<Booking>> {
    try {
      const { limit = 10, offset = 0 } = page || {}
      const { by, order = 'desc' } = sort || {}

      const total = await this.bookingModel.countDocuments()
      const data = await this.bookingModel
        .find()
        .sort({ [by]: order === 'desc' ? -1 : 1 })
        .limit(limit)
        .skip(limit * offset)
      return { limit, offset, total, data }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        error = new HttpException(
          error.message || "Birozdan so'ng urinib ko'ring",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
      throw error
    }
  }
  async findOnePersonBookings ({ page, sort }: QueryDto, req: CustomRequest) {
    try {
      const { limit = 10, offset = 0 } = page || {}
      const { by, order = 'desc' } = sort || {}
      const { _id } = req.user
      const total = await this.bookingModel
        .find({ bookingBy: _id })
        .countDocuments()
      const data = await this.bookingModel
        .find({ bookingBy: _id })
        .populate([
          {
            path: 'stadion',
            populate: {
              path: 'owner',
              model: 'Owner',
              select: 'name  email '
            },
            select: 'destination callnumber'
          },
          {
            path: 'bookingBy',
            select: 'name  email '
          }
        ])
        .sort({ [by]: order === 'desc' ? -1 : 1 })
        .limit(limit)
        .skip(limit * offset)
        .exec()
      return { limit, offset, total, data }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        error = new HttpException(
          error.message || "Birozdan so'ng urinib ko'ring",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
      throw error
    }
  }

  async confirmed (req: CustomRequest, id: string, data: StatusBookingDto) {
    try {
      const { _id } = req.user
      const confirmed = await this.bookingModel.findByIdAndUpdate(
        id,
        { ...data },
        { new: true }
      )
      if (!confirmed)
        throw new BadRequestException({
          msg: 'Ushbu IDli tasdiqlash mavjud emas!'
        })
      this.socketService.sendMessage({
        to: confirmed.bookingBy.toString(),
        message: `Stadion, ${formatDateWithMonthNames(
          confirmed.from
        )} vaqtli o'yin uchun ajrtaildi!`,
        by: _id
      })
      return { msg: 'Oke' }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        error = new HttpException(
          error.message || "Birozdan so'ng urinib ko'ring",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
      throw error
    }
  }

  findOneStadions (id: string) {
    try {
      return this.bookingModel.find({ stadion: id, status: 'confirmed' })
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

  async removeMyBooking (id: string, req: CustomRequest) {
    try {
      const { _id } = req.user
      const isPossible = await this.bookingModel.find({
        _id: id,
        status: 'confirmed'
      })
      if (!isPossible) {
        throw new BadRequestException({
          msg: "Stadion tasdiqlangan, Bu holatda siz o'chira olmaysiz!",
          succes: false
        })
      }
      await this.bookingModel.findOneAndDelete({ bookingBy: _id, _id: id })
      return { msg: 'Mufaqqiyatli bekor qilindi!' }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        error = new HttpException(
          error.message || "Birozdan so'ng urinib ko'ring",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
      throw error
    }
  }

  async remove (id: string) {
    try {
      const deleted = await this.bookingModel.findByIdAndDelete(id)
      if (deleted) {
        return { msg: 'Mufaqqiyatli ochirildi!' }
      }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        error = new HttpException(
          error.message || "Birozdan so'ng urinib ko'ring",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
      throw error
    }
  }
}
