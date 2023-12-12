import { IsString } from "class-validator";
import { IsPhoneNumber } from "src/shared/dto";

export class CreateOwnerDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsPhoneNumber({ message: 'Invalid phone number format.' })
  callnumber: string;
}
export class LoginOwnerDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
