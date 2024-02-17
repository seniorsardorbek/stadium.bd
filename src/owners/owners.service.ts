import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcryptjs'
import { Response } from 'express'
import { Model } from 'mongoose'
import { QueryDto } from 'src/shared/dto/query.dto'
import { PaginationResponse } from 'src/shared/respone/response'
import * as XLSX from 'xlsx'
import { CreateOwnerDto, LoginOwnerDto } from './dto/create-owner.dto'
import { UpdateOwnerDto } from './dto/update-owner.dto'
import { Owner } from './schemas/Owner'
import config from 'src/shared/config'

@Injectable()
export class OwnersService {
  constructor (
    @InjectModel(Owner.name) private ownerModel: Model<Owner>,
    private readonly jwtService: JwtService
  ) {}
  async findAll ({
    page,
    q,
    sort
  }: QueryDto): Promise<PaginationResponse<Owner>> {
    try {
      const { limit = 10, offset =0 } = page || {}
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
        .populate({path :"stadiums"})
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

  // ? create owner 100%
  async register (data: CreateOwnerDto) {
    try {
      const existEmail = await this.ownerModel.findOne({
        email: data.email
      })
      const existPhone = await this.ownerModel.findOne({
        callnumber: data.callnumber
      })
      if (existEmail || existPhone) {
        throw new BadRequestException(
          'Elektron pochtadan yoki mobil raqamdan  allaqacon foydalanilgan!'
        )
      }
      const hash = await bcrypt.hash(data.password, 15)
      data.password = hash
      const owner = await this.ownerModel.create(data)
      return {
        msg: "Mufaqqiyatli  ro'yxatdan o'tkazildi!",
        succes: true,
        data: {
          id: owner._id,
          name: owner.name,
          email: owner.email,
          callnumber: owner.callnumber
        }
      }
    } catch (error) {
      
      throw new BadRequestException({
        msg: "Birozdan so'ng urinib koring...",
        success: false,
        error
      })
    }
  }
  async login (data: LoginOwnerDto) {
    try {
      const { email, password } = data
      const owner = await this.ownerModel.findOne({ email })
      if (!owner) {
        throw new UnauthorizedException(
          'Elektron pochta yoki parolingingiz xato!'
        )
      }
      const isPasswordValid = await bcrypt.compare(password, owner.password)
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          'Elektron pochta yoki parolingingiz xato!'
        )
      }
      const { _id, role } = owner
      const token = await this.jwtService.signAsync(
        { _id, role },
        { secret: config.jwt.secret }
      )
      return {
        message: 'Mufaqqiyatli kirdingiz!',
        token,
        data: { id: owner._id, name: owner.name, email: owner.email }
      }
    } catch (error) {
      throw new BadRequestException({
        msg: "Birozdan so'ng urinib koring...",
        success: false,
        error
      })
    }
  }
  // ? update 100%
  async update (id: string, data: UpdateOwnerDto) {
    try {
      const exist = await this.ownerModel.findById(id)
      if (!exist) {
        throw new NotFoundException('Owner topilmadi.')
      }
      if (data.password) {
        const hash = await bcrypt.hash(data.password, 15)
        data.password = hash
      }
      const user = await this.ownerModel.findByIdAndUpdate(id, data, {
        new: true
      })
      return {
        msg: 'Mufaqqiyatli yangilandi',
        succes: true,
        data: user
      }
    } catch (error) {
      throw new BadRequestException({
        msg: "Birozdan so'ng urinib koring...",
        success: false,
        error
      })
    }
  }

  // ? delete 100%
  async remove (id: string) {
    try {
      const exist = await this.ownerModel.findById(id)
      if (!exist) {
        throw new NotFoundException('Owner topilmadi.')
      }
      await this.ownerModel.findByIdAndDelete(id)
      return {
        msg: "Mufaqqiyatli o'chirildi",
        succes: true
      }
    } catch (error) {
      throw new BadRequestException({
        msg: "Birozdan so'ng urinib koring...",
        success: false,
        error
      })
    }
  }

  async exe (@Res() res: Response) {
    try {
      const data = await this.ownerModel.find().exec() // Fetch data from MongoDB
      const jsonData = data.map((item: any) => item.toObject()) // Convert Mongoose documents to plain objects
      const ws = XLSX.utils.json_to_sheet(jsonData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'DataSheet')
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })
      res.setHeader('Content-Disposition', 'attachment; filename=owners.xlsx')
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      res.send(excelBuffer)
    } catch (error) {
      throw new BadRequestException({
        msg: "Birozdan so'ng urinib koring...",
        success: false,
        error
      })
    }
  }
}
