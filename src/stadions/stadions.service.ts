import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaginationResponse } from "src/shared/respone/response";
import { deleteFile } from "src/shared/utils/utils";
import { Stadion } from "./Schema/Schema";
import { CreateStadionDto } from "./dto/create-stadion.dto";
import { QueryDto } from "./dto/query.stadium.dto";
@Injectable()
export class StadionsService {
  constructor(
    @InjectModel(Stadion.name) private stadionModel: Model<Stadion>,
  ) { }
  create(data: CreateStadionDto, image: Array<Express.Multer.File>) {
    if (!image?.length)
      throw new BadRequestException({
        msg: " Stadion uchun rasm qatiy!",
        succes: false,
      });
    const images = image.map((el) => {
      return el.filename;
    });
    const newdata = this.stadionModel.create({
      ...data,
      images,
      loc: { type: "Point", coordinates: [data?.lat, data?.lng] },
    });
    return newdata;
  }

  async findAll({
    page,
    q,
    sort,
    nearby,
  }: QueryDto): Promise<PaginationResponse<Stadion>> {
    const { limit, offset } = page || {};
    const { by = "year", order = "desc" } = sort || {};
    const { lat, lng, maxDistance } = nearby || {};
    const search = q
      ? {
        destination: {
          $regex: q,
          $options: "i",
        },
      }
      : {};
      
    const isHere = nearby
      ? {
        loc: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lat, lng],
              maxDistance: maxDistance * 1000,
            },
          },
        },
      }
      : {};
    const data = await this.stadionModel.find({ ...search, ...isHere }).sort({ [by]: order });
    return { limit, offset, total: data?.length , data };
  }

  // ? find One
  findOne(id: string) {
    return this.stadionModel
      .findById(id)
      .populate("owner", ["name", "email", -"_id"]);
  }

  // ?delete
  async remove(id: string) {
    const exist = await this.stadionModel.findById(id);
    if (!exist)
      throw new BadRequestException({
        msg: "Stadion topilmadi!",
        succes: false,
      });
    exist.images.map((e) => deleteFile("uploads", e));
    return this.stadionModel.findByIdAndDelete(id);
  }
}
