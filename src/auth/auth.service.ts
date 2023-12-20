import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MailService } from "src/mail/mail.service";
import { User } from "src/user/schemas/User";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<User>,
    private readonly jwtService: JwtService, private mailService: MailService
  ) { }

  async login( data: LoginDto) {
    const {code} = data
    const exist  = await this.userModel.findOne({verification : code }).select('name ')
    if(!exist){
      throw  new BadRequestException({msg :  'Xatolik'})
    }
    const token = this.jwtService.sign({role :  exist.role , id : exist._id})
    return {
      token  ,
      data: exist
    }
  }

}


