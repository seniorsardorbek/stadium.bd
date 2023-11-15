import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min } from "class-validator";

export class Paginate {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit?: number;
}

export class Filter {
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value === "true") return true;
    else if (value === "false") return false;
    return value;
  })
  @IsBoolean()
  is_deleted: boolean;
}
