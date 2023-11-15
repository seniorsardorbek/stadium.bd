import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import config from "src/shared/config";
interface Session {
  passport?: {
    user: {
      // Define the properties of the 'user' object as needed
      _id: string;
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      is_deleted: boolean;
      role: string;
      created_at: string;
      updated_at: string;
    };
  };
  // Define other properties of the session if needed
}

@Injectable()
export class IsLoggedIn implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: config.jwt.secret,
      });
      request["user"] = payload;
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
  async canActivate(context: ExecutionContext) {
    const activate = (await super.canActivate(context)) as boolean;
    const requestt = context.switchToHttp().getRequest();
    await super.logIn(requestt);
    return activate;
  }
}
