import { Transform } from "class-transformer";
import { IsEnum, IsMongoId, IsNumber, IsPhoneNumber } from "class-validator";
import mongoose from "mongoose";

export class CreateBookingDto {
  @IsMongoId()
  stadion: mongoose.ObjectId;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  from: number;
  @IsPhoneNumber("UZ", {
    message: "Invalid phone number format.",
    always: true,
  })
  callnumber: string;

  // @Transform(({ value }) => Number(value))
  // @IsNumber()
  // to: number
}
export class StatusBookingDto {
  @IsEnum(["confirmed", "rejected", "pending"])
  status: "confirmed" | "rejected" | "pending";
}
