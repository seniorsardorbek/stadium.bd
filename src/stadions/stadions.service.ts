import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateStadionDto } from "./dto/create-stadion.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Stadion } from "./Schema/Schema";
import { PaginationResponse } from "src/shared/respone";
import { QueryDto } from "./dto/query.stadium.dto";
import { deleteFile } from "src/shared/utils";

@Injectable()
export class StadionsService {
  constructor(
    @InjectModel(Stadion.name) private stadionModel: Model<Stadion>,
  ) { }
  create(data: CreateStadionDto, image: Array<Express.Multer.File>) {
    console.log(data);
    console.log(image);
    if (!image?.length) throw new BadRequestException({ msg: " Stadion uchun rasm qatiy!"  , succes : false})
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
              coordinates: [lat, lng],
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

  // ? find One
  findOne(id: string) {
    return this.stadionModel
      .findById(id)
      .populate("owner", ["name", "email", -"_id"]);
  }

  // ?delete
  async remove(id: string) {
    const exist = await this.stadionModel.findById(id);
    if (!exist) throw new BadRequestException({ msg: 'Stadion topilmadi!', succes: false })
    exist.images.map((e) =>
      deleteFile('uploads', e)
    );
    return this.stadionModel.findByIdAndDelete(id);
  }
}
