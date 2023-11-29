import { Injectable } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { MonthStat } from './Schema/MonthStat';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/User';
import { Booking } from 'src/bookings/Schema/Schema';
import { Owner } from 'src/owners/schemas/Owner';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(MonthStat.name) private statisticsModel: Model<MonthStat>,
    @InjectModel(User.name) private usersModul: Model<User>,
    @InjectModel(Booking.name) private bookingsModule: Model<Booking>,
    @InjectModel(Owner.name) private ownersModule: Model<Owner>,
  ) { }
  create(createStatisticDto: CreateStatisticDto) {
    return 'This action adds a new statistic';
  }

  async findAll() {
    const usersCount = await this.usersModul.count()
    const ownersCount = await this.ownersModule.count()
    const bookingCount = await this.bookingsModule.count()
    return {
      succes: true,
      counts: {
        bookingCount, usersCount, ownersCount
      }
    };
  }

  async monthStat() {
    const stats =  await this.statisticsModel.find();
    return {
      succes : true ,
       stats 
    }
  }

  update(id: number, updateStatisticDto: UpdateStatisticDto) {
    return `This action updates a #${id} statistic`;
  }

  remove(id: number) {
    return `This action removes a #${id} statistic`;
  }


  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  handleCron() {
    this.createDynamicField();
  }

  async createDynamicField() {
    try {
      const currentDate = new Date();
      const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0, 23, 59, 59, 999);
      console.log(startOfLastMonth);
      console.log(endOfLastMonth);
      const countUsers = await this.usersModul.count({
        created_at: {
          $gte: startOfLastMonth,
          $lt: endOfLastMonth
        }
      })
      this.statisticsModel.create({ field: 'users', count: countUsers })
      const countBookings = await this.bookingsModule.count({
        created_at: {
          $gte: startOfLastMonth,
          $lt: endOfLastMonth
        }
      })
      this.statisticsModel.create({ field: 'bookings', count: countBookings })
    } catch (error) {
      console.log(error);
    }
  }
}
