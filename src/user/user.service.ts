import { Injectable, NotFoundException, Res } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Response } from "express";
import { Model } from "mongoose";
import { PaginationResponse } from "src/shared/respone/response";
import { CustomRequest } from "src/shared/types/types";
import * as XLSX from "xlsx";
import { QueryDto } from "./dto/query.dto";
import { User } from "./schemas/User";
const Salt = 15;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>) {}


  async list({ page, q, sort }: QueryDto): Promise<PaginationResponse<User>> {
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

    const total = await this.userModel.find({ ...search }).countDocuments();

    const data = await this.userModel
      .find( {  ...search })
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
      data: user,
    };
  }

  async showme(req: CustomRequest) {
    const { _id } = req.user;
    const user = await this.userModel
      .findById(_id)
      .select("name phonenumber");
    if (!user) {
      throw new NotFoundException("User topilmadi.");
    }
    return {
      msg: "Mufaqqiyatli olindi",
      succes: true,
      data: user,
    };
  }

  
  async aMonthUsers() {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    const firstDayOfNextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );
    const q = {};
    const user = await this.userModel
      .find({
        created_at: {
          $gte: firstDayOfMonth,
          $lt: firstDayOfNextMonth,
        },
      })
      .select("-password");
    return {
      msg: "Mufaqqiyatli olindi",
      succes: true,
      data: user,
    };
  }



  async delete(id: string) {
    const exist = await this.userModel.findById(id);
    if (!exist) {
      throw new NotFoundException("Foydalanuvchi topilmadi.");
    }
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
