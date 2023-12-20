import { IsString } from "class-validator";
import { IsImageFile } from "src/shared/image-file.validator";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  phonenumber: string;

  @IsString()
  password: string;

  @IsImageFile({ message: "File must be a valid image (jpeg, png, gif)." })
  avatarka: Express.Multer.File;
}
