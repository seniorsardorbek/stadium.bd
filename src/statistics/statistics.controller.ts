import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateStatisticDto } from "./dto/create-statistic.dto";
import { UpdateStatisticDto } from "./dto/update-statistic.dto";
import { StatisticsService } from "./statistics.service";

@Controller("statistics")
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Post()
  create(@Body() createStatisticDto: CreateStatisticDto) {
    return this.statisticsService.create(createStatisticDto);
  }

  @Get()
  findAll() {
    return this.statisticsService.findAll();
  }

  @Get("monthly")
  findOne() {
    return this.statisticsService.monthStat();
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateStatisticDto: UpdateStatisticDto,
  ) {
    return this.statisticsService.update(+id, updateStatisticDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.statisticsService.remove(+id);
  }
}
