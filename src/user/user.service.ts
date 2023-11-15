import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Res,
} from "@nestjs/common";
import { User } from "./schemas/User";
import { Response } from "express";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryDto } from "./dto/query.dto";
import { PaginationResponse } from "src/shared/respone";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcryptjs";
import * as XLSX from "xlsx";
import { JwtService } from "@nestjs/jwt";
const Salt = 15;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async list({
    page,
    q,
    sort,
    filter,
  }: QueryDto): Promise<PaginationResponse<User>> {
    const { limit, offset } = page || {};
    const { by, order = "desc" } = sort || {};
    const { is_deleted, role } = filter || {};
console.log(filter);
    const search = q
      ? {
          name: {
            $regex: q,
            $options: "i",
          },
        }
      : {};

    const total = await this.userModel
      .find({ ...search, ...filter })
      .countDocuments();

    const data = await this.userModel
      .find({ ...search, ...filter })
      .sort({ [by]: order === "desc" ? -1 : 1 })
      .limit(limit)
      .skip(limit * offset);
    return { limit, offset, total, data };
  }

  async show(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException("User topilmadi.");
    }
    return user;
  }

  async create(data: CreateUserDto) {
    try {
      const exist = await this.userModel.findOne({ email: data.email });
      if (exist) {
        throw new BadRequestException(
          "Elektron pochtadan allaqacon foydalanilgan!",
        );
      }
      const hash = await bcrypt.hash(data.password, Salt);
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

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const exist = await this.userModel.findById(id);
    if (!exist) {
      throw new NotFoundException("User topilmadi.");
    }
    if (data.password) {
      const hash = await bcrypt.hash(data.password, Salt);
      data.password = hash;
    }
    const user = await this.userModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return user;
  }

  async delete(id: string): Promise<User> {
    const exist = await this.userModel.findById(id);
    if (!exist) {
      throw new NotFoundException("User topilmadi.");
    }
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true },
    );
    return user;
  }

  async exelle(@Res() res: Response) {
    const data = await this.userModel.find().exec(); // Fetch data from MongoDB

    const jsonData = data.map((item: any) => item.toObject()); // Convert Mongoose documents to plain objects

    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DataSheet");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.send(excelBuffer);
  }
}
