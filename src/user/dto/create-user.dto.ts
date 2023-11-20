import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { IsImageFile } from "src/shared/image-file.validator";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
  
  @IsImageFile({ message: 'File must be a valid image (jpeg, png, gif).' })
  avatarka: Express.Multer.File;
}

