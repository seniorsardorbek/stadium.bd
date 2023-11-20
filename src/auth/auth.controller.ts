import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UsePipes,
  ValidationPipe,
  Res,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import {  Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { CustomRequest } from "src/shared/types/types";
import { RegisterDto } from "./dto/register.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/shared/multer.options";

@Controller("auth")
@UsePipes(ValidationPipe)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    readonly jwtservice: JwtService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Res() res: Response, @Body() data: LoginDto, @Req() req: CustomRequest) {
    return this.authService.login(res, data);
  }

  @Post("register")
  @UseInterceptors(FileInterceptor('avatarka', multerOptions))
  register(@Body() data: RegisterDto , @UploadedFile() avatarka: Express.Multer.File , @Res() res: Response) {
    return this.authService.register(res, {...data, avatarka});
  }
}
