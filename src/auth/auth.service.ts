import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/user/schemas/User'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor (
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async login (data: LoginDto) {
    try {
      const { code } = data
      const exist = await this.userModel
        .findOne({ verification: code })
        .select('name ')
      if (!exist) {
        throw new BadRequestException({ msg: 'Tasdiqlash kodi xato!' })
      }
      const token = this.jwtService.sign({ role: exist.role, _id: exist._id })
      return {
        token,
        data: exist
      }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        error = new HttpException(
          error.message || "Birozdan so'ng urinib ko'ring",
          HttpStatus.BAD_REQUEST
        )
      }
      throw error
    }
  }
}
