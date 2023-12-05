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
import { deleteFile } from "src/shared/utils/utils";
import config from "src/shared/config";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<User>,
    private readonly jwtService: JwtService, private mailService: MailService
  ) { }

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
    const token = this.jwtService.sign(
      { _id, role },
      { secret: config.jwt.secret, expiresIn: "7d" },
    );
    res.send({
      msg: "Mufaqqiyatli  ro'yxatdan o'tdingiz!",
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarka: user.avatarka,
      },
    });
  }

  async register(res: Response, data: RegisterDto) {
    try {
      if (!data.avatarka)
        throw new BadRequestException({ msg: "Profile uchun rasm qatiy!", succes: false });
      const allowedMimeTypes = ["image/jpeg", "image/png"];
      if (!allowedMimeTypes.includes(data.avatarka.mimetype)) {
        deleteFile("uploads", data.avatarka.filename);
        throw new BadRequestException({
          msg: "Profile uchun rasm formatlari!",
          succes: false,
          allowedMimeTypes,
        });
      }
      const exist = await this.userModel.findOne({ email: data.email });
      if (exist) {
        deleteFile("uploads", data.avatarka.filename);
        throw new BadRequestException(
          { msg: "Elektron pochtadan allaqacon foydalanilgan!", succes: false },
        );
      }
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const hash = await bcrypt.hash(data.password, 15);
      data.password = hash;
      const user = await this.userModel.create({
        ...data,
        avatarka: data.avatarka.filename, verificationCode
      });
      this.mailService.sendEmail(user.email, 'Tasdiqlash kodi', 'Bir daqiqa ichida kodni kiriting va emailni tasdiqlang', `<p>Hello,</p>
      <p>Thank you for registering with our application. Please use the following verification code to activate your account:</p>
      <h2><strong>${verificationCode}</strong></h2>
      <p>If you did not request this code, please disregard this email. Your account will not be activated.</p>
      <p>Best regards,</p>
      <p>Gym Bro LLC</p>`)

      res.send({
        msg: "Tasdiqlash kodini kiriting!",
        success: true,

      });
    } catch (error) {
      throw error;
    }
  }
  async verifyEmail(email: string, code: string) {
    const user = await this.userModel.findOneAndUpdate(
      { email, verificationCode: code },
      { isVerified: true, verificationCode: null },
      { new: true }
    );
    const { _id, role } = user;
    const token = this.jwtService.sign(
      { _id, role },
      { secret: config.jwt.secret, expiresIn: "7d" },
    );
    return {
      msg: "Mufaqqiyatli  ro'yxatdan o'tdingiz!",
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarka: user.avatarka,
      },
    };
  }
}
