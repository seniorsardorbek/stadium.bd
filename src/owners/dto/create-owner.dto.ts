import { IsString } from "class-validator";

export class CreateOwnerDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  callnumber: string;
}
export class LoginOwnerDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
