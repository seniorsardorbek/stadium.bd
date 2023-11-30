import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { LoginDto } from "./dto/login.dto";
import { Model } from "mongoose";
import { User } from "src/user/schemas/User";
import * as bcrypt from "bcryptjs";
import { RegisterDto } from "./dto/register.dto";
import { Response } from "express";
// import { deleteFile } from "src/shared/utils/utils";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(res: Response, data: LoginDto) {
    const { email, password } = data;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(
        "Elektron pochta yoki parolingingiz xato!",
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        "Elektron pochta yoki parolingingiz xato!",
      );
    }
    const { _id, role } = user;
    const token = this.jwtService.sign({ _id, role }, { secret: "Hey", expiresIn: "7d" })
    res.send({
      msg: "Mufaqqiyatli  ro'yxatdan o'tdingiz!",
      success: true,
      token,
      data: { id: user._id, name: user.name, email: user.email , avatarka : user.avatarka },
    })
  }

  async register(res: Response, data: RegisterDto) {
    try {
      if (!data.avatarka) throw new BadRequestException({ msg: "Profile uchun rasm qatiy!" })
      const allowedMimeTypes = ['image/jpeg', 'image/png',];
      // if (!allowedMimeTypes.includes(data.avatarka.mimetype)) {
      //   deleteFile('uploads', data.avatarka.filename)
      //   throw new BadRequestException({ msg: "Profile uchun rasm formatlari!", allowedMimeTypes })
      // }
      // const exist = await this.userModel.findOne({ email: data.email });
      // if (exist) {
      //   deleteFile('uploads', data.avatarka.filename)
      //   throw new BadRequestException(
      //     "Elektron pochtadan allaqacon foydalanilgan!",
      //   );
      // }
      const hash = await bcrypt.hash(data.password, 15);
      data.password = hash;
      const user = await this.userModel.create({ ...data, avatarka: data.avatarka.filename });
      const { _id, role } = user;
      const token = this.jwtService.sign({ _id, role }, { secret: "Hey", expiresIn: "7d" })
      res.send({
        msg: "Mufaqqiyatli  ro'yxatdan o'tdingiz!",
        success: true,
        token,
        data: { id: user._id, name: user.name, email: user.email , avatarka : user.avatarka },
      })

    } catch (error) {
      throw error;
    }
  }
}
