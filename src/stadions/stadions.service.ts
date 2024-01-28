import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { PaginationResponse } from 'src/shared/respone/response'
import { deleteFile } from 'src/shared/utils/utils'
import { Stadion } from './Schema/Schema'
import { CreateStadionDto } from './dto/create-stadion.dto'
import { QueryDto } from './dto/query.stadium.dto'
@Injectable()
export class StadionsService {
  constructor (@InjectModel(Stadion.name) private stadionModel: Model<Stadion>) {}

  create (data: CreateStadionDto, image: Array<Express.Multer.File>) {
    try {
      if (!image?.length)
        throw new BadRequestException({
          msg: ' Stadion uchun rasm qatiy!',
          succes: false
        })
      const images = image.map(el => {
        return el.filename
      })
      const newdata = this.stadionModel
        .create({
          ...data,
          images,
          loc: { type: 'Point', coordinates: [data?.lat, data?.lng] }
        })
        .catch(err => {
          images.map(e => deleteFile('uploads', e))
          throw new BadRequestException({
            msg: "Ma'lumotlar bilan xatolik bor ",
            succes: false,
            err: err.message
          })
        })
      return { msg: 'Stadion yaratildi, davom eting...', data: newdata }
    } catch (error) {
      throw new BadRequestException({
        msg: "Ma'lumotlar bilan xatolik bor",
        success: false
      })
    }
  }

  async findAll ({
    page,
    q,
    sort,
    nearby
  }: QueryDto): Promise<PaginationResponse<Stadion>> {
    // try {
      const { limit, offset } = page || {}
      const { by = 'year', order = 'desc' } = sort || {}
      const { lat, lng, maxDistance } = nearby || {}
      const search = q
        ? {
            destination: {
              $regex: q,
              $options: 'i'
            }
          }
        : {}

      const isHere = nearby
        ? {
            loc: {
              $near: {
                $geometry: {
                  type: 'Point',
                  coordinates: [lat, lng],
                  maxDistance: maxDistance * 1000
                }
              }
            }
          }
        : {}
      const data = await this.stadionModel
        .find({ ...search, ...isHere })
        .sort({ [by]: order })
        .limit(limit)
      .skip(limit * offset)
      return { limit, offset, total: data?.length, data }
    // } catch (error) {
    //   throw new BadRequestException({
    //     msg: "Birozdan so'ng urinib koring...",
    //     success: false ,
    //     error 
    //   })
    // }
  }

  // ? find One
  findOne (id: string) {
    try {
      return this.stadionModel
        .findById(id)
        .populate('owner', ['name', 'phonenumber'])
    } catch (error) {
      throw new BadRequestException({
        msg: "Birozdan so'ng urinib koring...",
        success: false ,
        error 
      })
    }
  }

  // ?delete
  async remove (id: string) {
    try {
      const exist = await this.stadionModel.findById(id)
      if (!exist)
        throw new BadRequestException({
          msg: 'Stadion topilmadi!',
          succes: false
        })
      exist.images.map(e => deleteFile('uploads', e))
      return this.stadionModel.findByIdAndDelete(id)
    } catch (error) {
      throw new BadRequestException({
        msg: "Birozdan so'ng urinib koring...",
        success: false ,
        error 
      })
    }
  }
}
