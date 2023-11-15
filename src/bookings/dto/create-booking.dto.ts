import { Transform } from "class-transformer";
import { IsBoolean, IsMongoId, IsNumber, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateBookingDto {
  @IsMongoId()
  stadion: mongoose.ObjectId;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  from: number;
  @Transform(({ value }) => Number(value))
  @IsNumber()
  callNumber: number;

  // @Transform(({ value }) => {
  //     if (value === 'true') return true;
  //     else if (value === 'false') return false;
  //     return value;
  //   })
  // @IsBoolean()
  // confirmed: boolean

  // @Transform(({ value }) => Number(value))
  // @IsNumber()
  // to: number
}
