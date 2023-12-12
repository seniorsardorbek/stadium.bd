import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Response } from "express";
import { Model } from "mongoose";
import { MailService } from "src/mail/mail.service";
import config from "src/shared/config";
import { deleteFile } from "src/shared/utils/utils";
import { User } from "src/user/schemas/User";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto, VerifyDto } from "./dto/register.dto";

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
      const exist = await this.userModel.findOne({ email: data.email, isVerified: true });
      if (exist) {
        deleteFile("uploads", data.avatarka.filename);
        throw new BadRequestException(
          { msg: "Elektron pochtadan allaqacon foydalanilgan!", succes: false },
        );
      }


      const unVerifiedUser = await this.userModel.findOne({ email: data.email, isVerified: false });
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
      const verificationText = `<p>Hello,</p>
      <p>Thank you for registering with our application. Please use the following verification code to activate your account:</p>
      <h2><strong>${verificationCode}</strong></h2>
      <p>If you did not request this code, please disregard this email. Your account will not be activated.</p>
      <p>Best regards,</p>
      <p>Gym Bro LLC</p>`
      if (unVerifiedUser) {
        deleteFile("uploads", data.avatarka.filename);
        this.mailService.sendEmail(unVerifiedUser.email, 'Tasdiqlash kodi', 'Bir daqiqa ichida kodni kiriting va emailni tasdiqlang', verificationText)
        await this.userModel.findOneAndUpdate({ email: data.email }, { verificationCode })
        return res.send({
          msg: "Tasdiqlash kodini kiriting!",
          success: true,

        });
      }

      const hash = await bcrypt.hash(data.password, 15);
      data.password = hash;
      const user = await this.userModel.create({
        ...data,
        avatarka: data.avatarka.filename, verificationCode
      });
      this.mailService.sendEmail(user.email, 'Tasdiqlash kodi', 'Bir daqiqa ichida kodni kiriting va emailni tasdiqlang', verificationText)

      res.send({
        msg: "Tasdiqlash kodini kiriting!",
        success: true,

      });
    } catch (error) {
      throw error;
    }
  }
  async verifyEmail(data: VerifyDto) {
    const { code, email } = data
    const user = await this.userModel.findOneAndUpdate(
      { email, verificationCode: code },
      { isVerified: true, verificationCode: null },
      { new: true }
    );
    if (!user) {
      throw new BadRequestException(
        { msg: "Tasdiqlash uchun oldin ruyxatdan o'ting!", succes: false },
      );
    }
    const { _id, role } = user;
    const token = this.jwtService.sign(
      { _id, role },
      { secret: config.jwt.secret, expiresIn: "7d" },
    );
    const expires = await this.userModel.find({ email: email, isVerified: false })
    expires?.map((el, i) => {
      deleteFile('uploads', el.avatarka)
    })
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
  async resendCode(email : string) {
    const user = await this.userModel.findOne(
      { email , isVerified: false  }
    );
    if (!user) {
      throw new BadRequestException({
        msg: 'Birinchi bosqichdan otilmagan',
        success: false
      })
    }
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    await this.userModel.findOneAndUpdate({email } , {verificationCode}, {new : true})
    const verificationText = `<p>Assalom alaykum!</p>
    <p>Ushbu kod, emailni tasdiqlashingiz uchun qayta yuborilgan kod</p>
    <h2><strong>${verificationCode}</strong></h2>
    <p>If you did not request this code, please disregard this email. Your account will not be activated.</p>
    <p>Kuningizni yaxshi o'tkazing</p>
    <p>MiniMatch.uz</p>`
    this.mailService.sendEmail(email, 'Tasdiqlash kodi', 'Bir daqiqa ichida kodni kiriting va emailni tasdiqlang', verificationText)

    return {
      msg: `Tasdiqlash kodi ${email} -ga yuborildi!`,
      success: true,
    };
  }
}


