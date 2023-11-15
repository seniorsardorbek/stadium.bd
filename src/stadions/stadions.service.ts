import { Injectable } from "@nestjs/common";
import { CreateStadionDto } from "./dto/create-stadion.dto";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Stadion, StadionSchema } from "./Schema/Schema";
import { PaginationResponse } from "src/shared/respone";
import { unlink } from "fs";
import { join } from "path";
import { QueryDto } from "./dto/query.stadium.dto";

@Injectable()
export class StadionsService {
  constructor(
    @InjectModel(Stadion.name) private stadionModel: Model<Stadion>,
  ) {}
  create(data: CreateStadionDto, image: Array<Express.Multer.File>) {
    const images = image.map((el) => {
      return el.filename;
    });
    const newdata = this.stadionModel.create({
      ...data,
      images,
      loc: { type: "Point", coordinates: [data.lat, data.lng] },
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
    const { by, order = "desc" } = sort || {};
    const { lat, lng, maxDistance } = nearby || {};
console.log(lat , lng);
    const search = q
      ? {
          description: {
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
                coordinates: [lat , lng],
                maxDistance: maxDistance * 1000,
              },
            },
          },
        }
      : {};

    const total = await this.stadionModel.find({ ...search }).countDocuments();

    const data = await this.stadionModel.find({ ...search, ...isHere });
    return { limit, offset, total, data };
  }

  // !!!!!!!!!!!
  findOne(id: string) {
    return this.stadionModel
      .findById(id)
      .populate("owner", ["name", "email", -"_id"]);
  }

  async remove(id: string) {
    const exist = await this.stadionModel.findById(id);
    exist.images.map((e) =>
      unlink(join(__dirname, "../../", "uploads", e), (err) => {
        if (err) {
          console.error(err);
          return;
        }
      }),
    );
    return this.stadionModel.findByIdAndRemove(id);
  }
}
