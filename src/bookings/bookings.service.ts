import { BadRequestException, Injectable, UseGuards, ValidationPipe } from "@nestjs/common";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Booking } from "./Schema/Schema";
import { Model } from "mongoose";
import { CustomRequest } from "src/shared/types/types";
import { EventsGateway } from "src/events/events.gateway";
import { Stadion } from "src/stadions/Schema/Schema";
import { formatDateWithMonthNames } from "src/shared/utils";

@Injectable()

export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Stadion.name) private stadionModel: Model<Stadion>,
    private socketService: EventsGateway,
    // private 
  ) { }
  async create(createBookingDto: CreateBookingDto, req: CustomRequest) {
    const { _id } = req.user;
    const exist = await this.bookingModel.find({
      stadion: createBookingDto.stadion,
      from: createBookingDto.from,
      confirmed: true,
    });
    const { owner } = await this.stadionModel.findById(
      createBookingDto.stadion,
    );

    if (exist[0]) {
      throw new BadRequestException({
        msg: "Bu vaqtda stadion bron qilingan!",
      });
    }
    const data = await this.bookingModel.create({
      ...createBookingDto,
      bookingBy: _id,
    });

    this.socketService.sendMessage({ to: owner, message: 'Sizning stadioningiz  bron qilindi', by: _id });

    return { msg: "Muvaffaqqiyatli booking qilindi!" };
  }

  findOnePersonBookings(req: CustomRequest) {
    const { _id } = req.user;
    return this.bookingModel
      .find({ bookingBy: _id })
      .populate([
        {
          path: "stadion",
          populate: {
            path: "owner",
            model: "Owner",
            select: 'name  email '
          },
          select: 'destination callnumber'
        },
        {
          path: 'bookingBy',
          select: 'name  email '
        }
      ])
      .exec();
  }

  async confirmed(req: CustomRequest, id: string) {
    const { _id } = req.user
    const confirmed = await this.bookingModel.findByIdAndUpdate(
      id,
      { confirmed: true },
      { new: true },
    );
    if (!confirmed) throw new BadRequestException({ msg: "Ushbu IDli tasdiqlash mavjud emas!" })
    this.socketService.sendMessage({ to: confirmed.bookingBy.toString() , message: `Stadion, ${formatDateWithMonthNames(confirmed.from)} vaqtli o'yin uchun ajrtaildi!`, by: _id })
    return confirmed;
  }

  findOneStadions(id: string) {
    return this.bookingModel.find({ stadion: id, confirmed: true });
  }

  async removeMyBooking(id: string, req: CustomRequest) {
    const { _id } = req.user;
    await this.bookingModel.findOneAndRemove({ bookingBy: _id, _id: id });
    return { msg: "Mufaqqiyatli bekor qilindi!" };
  }

  remove(id: string) {
    return `This action removes a #${id} booking`;
  }
}
