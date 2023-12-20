import { IsNumber } from "class-validator";

export class LoginDto {
  @IsNumber()
  code: number;
}
