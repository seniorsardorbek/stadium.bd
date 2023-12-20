import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

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
    @Body() data: {code :  number},
  ) {
    return this.authService.login( data);
  }


}
