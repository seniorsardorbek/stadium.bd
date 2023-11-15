import { Transform } from "class-transformer";
import {
  IsMongoId,
  IsNumber,
  IsObject,
  IsString,
  Length,
  Max,
  Min,
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
  @Length(10, 500, { message: "Description must be between 10 and 500 words." })
  description: string;

  @IsString()
  // @Length(3, 10, { message: 'Destination must be between 10 and 500 words.' })
  destination: string;

  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowNaN: false },
    { message: "Call number must be a valid number." },
  )
  callnumber: number;
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
