import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { PaginationResponse } from 'src/shared/respone/response'
import { CustomRequest } from 'src/shared/types/types'
import { QueryDto } from './dto/query.dto'
import { User } from './schemas/User'

@Injectable()
export class UserService {
  constructor (@InjectModel(User.name) private userModel: Model<User>) {}

  async list ({ page, q, sort }: QueryDto): Promise<PaginationResponse<User>> {
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

      const total = await this.userModel.find({ ...search }).countDocuments()

      const data = await this.userModel
        .find({ ...search })
        .sort({ [by]: order === 'desc' ? -1 : 1 })
        .limit(limit)
        .skip(limit * offset)
      return { limit, offset, total, data }
    } catch (error) {
      throw new BadRequestException({ msg: error.message, error })
    }
  }

  // ? getone 100%
  async show (id: string) {
    try {
      const user = await this.userModel.findById(id)
      if (!user) {
        throw new NotFoundException('User topilmadi.')
      }
      return {
        succes: true,
        data: user
      }
    } catch (error) {
      throw new BadRequestException({ msg: error.message, error })
    }
  }

  async showme (req: CustomRequest) {
    try {
      const { _id } = req.user
      const user = await this.userModel.findById(_id).select('name phonenumber')
      if (!user) {
        throw new NotFoundException('User topilmadi.')
      }
      return {
        succes: true,
        data: user
      }
    } catch (error) {
      throw new BadRequestException({ msg: error.message, error })
    }
  }


  async delete (id: string) {
    try {
      return this.userModel.findByIdAndDelete(id)
    } catch (error) {
      throw new NotFoundException({ msg: 'Foydalanuvchi topilmadi.', error })
    }
  }


}
