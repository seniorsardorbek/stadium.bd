import { Transform } from "class-transformer";
import { IsEmail, IsNumber, IsString } from "class-validator";

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  avatarka: Express.Multer.File;
}
export class VerifyDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  code: number;

  @IsEmail()
  email: string;

}
