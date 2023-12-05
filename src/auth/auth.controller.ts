import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { multerOptions } from "src/shared/multer.options";
import { CustomRequest } from "src/shared/types/types";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
@UsePipes(ValidationPipe)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    readonly jwtservice: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(
    @Res() res: Response,
    @Body() data: LoginDto,
    @Req() req: CustomRequest,
  ) {
    return this.authService.login(res, data);
  }

  @Post("register")
  @UseInterceptors(FileInterceptor("avatarka", multerOptions))
  register(
    @Body() data: RegisterDto,
    @UploadedFile() avatarka: Express.Multer.File,
    @Res() res: Response,
  ) {
    return this.authService.register(res, { ...data, avatarka });
  }

  
  @Post('verify-email')
  async verifyEmail(@Body('email') email: string, @Body('code') code: string): Promise<any> {
    return  this.authService.verifyEmail(email, code);
  }
}
