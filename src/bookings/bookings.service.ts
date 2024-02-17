import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EventsGateway } from 'src/events/events.gateway'
import { CustomRequest } from 'src/shared/types/types'
import { formatDateWithMonthNames } from 'src/shared/utils/utils'
import { Stadion } from 'src/stadions/Schema/Schema'
import { Booking } from './Schema/Schema'
import { CreateBookingDto, StatusBookingDto } from './dto/create-booking.dto'
import { QueryDto } from 'src/shared/dto/query.dto'
import { PaginationResponse } from 'src/shared/respone/response'

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
      const exist = await this.bookingModel.find({
        stadion: data.stadion,
        from: data.from
      })
      const { owner } = await this.stadionModel.findById(data.stadion)

      if (exist[0]) {
        throw new BadRequestException({
          msg: 'Bu vaqtda stadion bron qilingan!'
        })
      }

      await this.bookingModel.create({ ...data, bookingBy: _id })

      this.socketService.sendMessage({
        to: owner,
        message: 'Sizning stadioningiz  bron qilindi',
        by: _id
      })

      return { msg: 'Muvaffaqqiyatli booking qilindi!' }
    } catch (error) {
      throw new BadRequestException({
        msg: "Birozdan so'ng urinib koring...",
        success: false
      })
    }
  }

  async findAll ({
    page,
    sort
  }: QueryDto): Promise<PaginationResponse<Booking>> {
    try {
      const { limit = 10, offset = 0 } = page || {}
      const { by, order = 'desc' } = sort || {}

      const total = await this.bookingModel.find().countDocuments()
      const data = await this.bookingModel
        .find()
        .sort({ [by]: order === 'desc' ? -1 : 1 })
        .limit(limit)
        .skip(limit * offset)
      return { limit, offset, total, data }
    } catch (error) {
      throw new BadRequestException({
        msg: "Birozdan so'ng urinib koring...",
        success: false
      })
    }
  }
  findOnePersonBookings (req: CustomRequest) {
    const { _id } = req.user
    return this.bookingModel
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
      .exec()
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
      return {msg : "Oke"}
    } catch (error) {
      throw new BadRequestException({
        msg: "Birozdan so'ng urinib koring...",
        success: false
      })
    }
  }

  findOneStadions (id: string) {
    return this.bookingModel.find({ stadion: id, status: 'confirmed' })
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
        msg: 'Stadion tasdiqlangan, Bu holatda siz ochira olmaysiz!',
        succes: false
      })
    }
    await this.bookingModel.findOneAndRemove({ bookingBy: _id, _id: id })
    return { msg: 'Mufaqqiyatli bekor qilindi!' }
    } catch (error) {
      throw new BadRequestException({
        msg: "Birozdan so'ng urinib koring...",
        success: false
      })
    }
    
  }

  remove (id: string) {
    return `This action removes a #${id} booking`
  }
}
