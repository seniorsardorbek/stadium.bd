import { PartialType } from "@nestjs/mapped-types";
import { CreateStadionDto } from "./create-stadion.dto";

export class UpdateStadionDto extends PartialType(CreateStadionDto) {}
