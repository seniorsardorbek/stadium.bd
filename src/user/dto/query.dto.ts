import { Type } from "class-transformer";
import {
  IsEnum,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Paginate } from "src/shared/dto";
import { SortOrder } from "src/shared/enum";

class Sort {
  @IsEnum(SortOrder)
  order: SortOrder;

  @IsIn(["created_at"])
  by: string;
}

export class QueryDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Sort)
  sort?: Sort;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Paginate)
  page?: Paginate;

  @IsOptional()
  @IsString()
  q?: string;
}
