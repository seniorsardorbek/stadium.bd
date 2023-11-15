import { IsEnum, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsEnum(["admin", "owner", "player"])
  role: "admin" | "owner" | "player";
}
