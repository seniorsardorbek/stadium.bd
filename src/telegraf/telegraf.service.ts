import { Injectable } from "@nestjs/common";
import { CreateTelegrafDto } from "./dto/create-telegraf.dto";
import { UpdateTelegrafDto } from "./dto/update-telegraf.dto";

@Injectable()
export class TelegrafService {
  create(createTelegrafDto: CreateTelegrafDto) {
    return "This action adds a new telegraf";
  }

  findAll() {
    return `This action returns all telegraf`;
  }

  findOne(id: number) {
    return `This action returns a #${id} telegraf`;
  }

  update(id: number, updateTelegrafDto: UpdateTelegrafDto) {
    return `This action updates a #${id} telegraf`;
  }

  remove(id: number) {
    return `This action removes a #${id} telegraf`;
  }
}
