import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  UseGuards,
  HttpStatus,
  Inject,
  Req,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { GoogleAuthGuard } from "./is-loggin.guard";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { CustomRequest, UserDetails } from "src/shared/types/types";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
@UsePipes(ValidationPipe)
export class AuthController {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authService: AuthService,
    readonly jwtservice: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() data: LoginDto, @Req() req: CustomRequest) {
    return this.authService.login(req, data);
  }
  @Post("register")
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }
  @Get("google/login")
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { ms: "hello google" };
  }

  @Get("google/redirect")
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() req: Request) {
    const { role, _id } = req.user as UserDetails;
    const token = this.jwtservice.sign({
      user: { id: _id, role: role },
    });
    return { ms: token };
  }
  @Get("status")
  user(@Req() request: Request) {
    if (request.user) {
      return { msg: "Authenticated" };
    } else {
      return { msg: "Not Authenticated" };
    }
  }
}
