import {
  Injectable,
  NotFoundException,
  Res,
} from "@nestjs/common";
import { User } from "./schemas/User";
import { Response } from "express";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { QueryDto } from "./dto/query.dto";
import { PaginationResponse } from "src/shared/respone";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcryptjs";
import * as XLSX from "xlsx";
import { JwtService } from "@nestjs/jwt";
import { deleteFile } from "src/shared/utils";
import { CustomRequest } from "src/shared/types/types";
const Salt = 15;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService
  ) { }


  // ? get lists100%
  async list({
    page,
    q,
    sort,
  }: QueryDto): Promise<PaginationResponse<User>> {
    const { limit, offset } = page || {};
    const { by, order = "desc" } = sort || {};
    const search = q
      ? {
        name: {
          $regex: q,
          $options: "i",
        },
      }
      : {};

    const total = await this.userModel
      .find({ ...search })
      .countDocuments();

    const data = await this.userModel
      .find({ ...search })
      .sort({ [by]: order === "desc" ? -1 : 1 })
      .limit(limit)
      .skip(limit * offset);
    return { limit, offset, total, data };
  }

  // ? getone 100%
  async show(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException("User topilmadi.");
    }
    return {
      msg: "Mufaqqiyatli olindi",
      succes: true,
      data: user
    };;
  }
  async showme(req : CustomRequest) {
     const {_id} =  req.user
    const user = await this.userModel.findById(_id).select('email  name avatarka ');
    if (!user) {
      throw new NotFoundException("User topilmadi.");
    }
    return {
      msg: "Mufaqqiyatli olindi",
      succes: true,
      data: user
    };;
  }

  
  // ? update 100%
  async update(id: string, data: UpdateUserDto) {
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
    return {
      msg: "Mufaqqiyatli yangilandi",
      succes: true,
      data: user
    };;
  }

  // ? delete 100%
  async delete(id: string) {
    const exist = await this.userModel.findById(id);
    if (!exist) {
      throw new NotFoundException("User topilmadi.");
    }
    deleteFile('uploads' , exist.avatarka)
    await this.userModel.findByIdAndDelete(
      id
    );
    return {
      msg: "Mufaqqiyatli o'chirildi",
      succes: true
    };
  }

  async exe(@Res() res: Response) {
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
