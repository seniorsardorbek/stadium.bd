import { Transform } from "class-transformer";
import {
  IsMongoId,
  IsNumber,
  IsObject,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { ObjectId } from "mongoose";

interface Size {
  h: number;
  w: number;
}

export class CreateStadionDto {
  @IsMongoId({ message: "Owner must be a valid ObjectId." })
  owner: ObjectId;

  @IsString()
  description: string;
  @IsString()
  destination: string;

  @IsPhoneNumber("UZ", {
    message: "Invalid phone number format.",
    always: true,
  })
  callnumber: string;

  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowNaN: false },
    { message: "Rate number must be a valid number." },
  )
  rate: number;

  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowNaN: false },
    { message: "Cost number must be a valid number." },
  )
  cost: number;

  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowNaN: false },
    { message: "Year number must be a valid number." },
  )
  year: number;

  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowNaN: false },
    { message: "Lng number must be a valid number." },
  )
  lng: number;

  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowNaN: false },
    { message: "Lat number must be a valid number." },
  )
  lat: number;

  @IsObject()
  @Transform(({ value }) => Object(value))
  size: Size;
}
