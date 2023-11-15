import { Transform, Type } from "class-transformer";
import {
  IsOptional,
  IsEnum,
  IsString,
  ValidateNested,
  IsNotEmpty,
  IsIn,
  IsObject,
  IsBoolean,
  IsNumber,
} from "class-validator";
import { Paginate } from "src/shared/dto";
import { SortOrder, UserRole } from "src/shared/enum";

class Sort {
  @IsEnum(SortOrder)
  order: SortOrder;

  @IsIn(["rate", "updated_at"])
  by: string;
}

class Nearby {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  lat: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  lng: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  maxDistance: number;
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

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Nearby)
  nearby?: Nearby;
}
