import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { QueryDto } from 'src/shared/dto/query.dto'
import { PaginationResponse } from 'src/shared/respone/response'
import { Owner } from './schemas/Owner'
import { CreateOwnerDto } from './dto/create-owner.dto'
import { OwnerBotUpdate } from './ownerbot.controller'
import { MENU } from 'src/shared/keyboards'

@Injectable()
export class OwnersService {
  constructor (
    @InjectModel(Owner.name) private ownerModel: Model<Owner>,
    private readonly ownerBotService: OwnerBotUpdate
  ) {}
  async findAll ({
    page,
    q,
    sort
  }: QueryDto): Promise<PaginationResponse<Owner>> {
    try {
      const { limit = 10, offset = 0 } = page || {}
      const { by, order = 'desc' } = sort || {}
      const search = q
        ? {
            name: {
              $regex: q,
              $options: 'i'
            }
          }
        : {}
      const total = await this.ownerModel.find({ ...search }).countDocuments()
      const data = await this.ownerModel
        .find({ ...search })
        .populate({ path: 'stadiums' })
        .select('-password')
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
  async register (id: string, verifyAdminDto: CreateOwnerDto) {
    try {
      console.log(verifyAdminDto);
      const verifiedAdmin = await this.ownerModel.findByIdAndUpdate(
        id,
        { isVerified: verifyAdminDto.verified },
        { new: true }
      )
      if (verifiedAdmin) {
        this.ownerBotService.sendMessage(
          verifiedAdmin?.chatId,
          `${
            verifyAdminDto.verified
              ? 'Tasdiqlandi ✅'
              : 'Tasdiqlash bekor qilindi ❌'
          }`,
          {
            reply_markup: {
              remove_keyboard: !verifyAdminDto.verified,
              ...(verifyAdminDto.verified ? MENU : {}),
            }
          }
        )
        return {
          msg: `${
            verifyAdminDto.verified
              ? 'Tasdiqlandi!'
              : 'Tasdiqlash bekor qilindi!'
          }`,
          verifiedAdmin
        }
      }
      return "Admin mavjud emas!"
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
  async verify (id: string, verifyAdminDto: CreateOwnerDto) {
    try {
      const verifiedAdmin = await this.ownerModel.findByIdAndUpdate(
        id,
        { isVerified: verifyAdminDto.verified },
        { new: true }
      )
      if (verifiedAdmin) {
        this.ownerBotService.sendMessage(
          verifiedAdmin?.chatId,
          `${
            verifyAdminDto.verified
              ? 'Tasdiqlandi ✅'
              : 'Tasdiqlash bekor qilindi ❌'
          }`,
          {
            reply_markup: {
              remove_keyboard: !verifyAdminDto.verified,
              ...(verifyAdminDto.verified ? MENU : {}),
            }
          }
        )
        return {
          msg: `${
            verifyAdminDto.verified
              ? 'Tasdiqlandi!'
              : 'Tasdiqlash bekor qilindi!'
          }`,
          verifiedAdmin
        }
      }
      return "Admin mavjud emas!"
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
  // ? getone 100%
  async findOne (id: string) {
    try {
      const owner = await this.ownerModel.findById(id)
      if (!owner) {
        throw new NotFoundException('Owner topilmadi!')
      }
      return {
        succes: true,
        data: owner
      }
    } catch (error) {
      throw new BadRequestException({
        msg: "Birozdan so'ng urinib koring...",
        success: false
      })
    }
  }
}
