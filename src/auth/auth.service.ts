import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService, JwtModule } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { LoginDto } from "./dto/login.dto";
import { Model } from "mongoose";
import { User } from "src/user/schemas/User";
import * as bcrypt from "bcryptjs";
import { CustomRequest, UserDetails } from "src/shared/types/types";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import config from "src/shared/config";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async login(request: CustomRequest, data: LoginDto) {
    const { email, password } = data;
    const user = await this.userModel.findOne({ email, is_deleted: false });
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
    const token = await this.jwtService.signAsync(
      { _id, role },
      { secret: config.jwt.secret },
    );
    return {
      message: "Mufaqqiyatli kirdingiz!",
      token,
      data: { id: user._id, name: user.name, email: user.email },
    };
  }
  async register(data: RegisterDto) {
    try {
      const exist = await this.userModel.findOne({ email: data.email });
      if (exist) {
        throw new BadRequestException("Username is already used!");
      }
      const hash = await bcrypt.hash(data.password, 15);
      data.password = hash;
      const user = await this.userModel.create(data);
      const { _id, role } = user;
      const token = this.jwtService.sign({ _id, role });
      return {
        message: "Mufaqqiyatli  ro'yxatdan o'tdingiz!",
        token,
        data: { id: user._id, name: user.name, email: user.email },
      };
    } catch (error) {
      throw error;
    }
  }

  logout(request: CustomRequest) {
    request.session.destroy((err) => {
      if (err) {
        throw new InternalServerErrorException(
          "Session could not be destroyed",
        );
      }
    });
  }
  getAuthenticatedUser(request: CustomRequest): User | undefined {
    return request.session.user;
  }
  async validateUser(details: CreateUserDto) {
    const user = await this.userModel.findOne({ email: details.email });
    if (user) {
      return user;
    }
    const { _id, role } = await this.userModel.create(details);
    return { _id, role };
  }
  async findUser(id: number) {
    const { _id, role } = await this.userModel.findById(id);
    return { _id, role };
  }
}
