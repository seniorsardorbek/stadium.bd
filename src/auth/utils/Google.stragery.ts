import { Injectable, Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStragery extends PassportStrategy(Strategy) {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authService: AuthService,
  ) {
    super({
      clientID:
        "845289591186-4iip49vu2012jll5rd6t9nnqgd0ij755.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:4000/api/auth/google/redirect",
      scope: ["profile", "email"],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.authService.validateUser({
      name: profile.name.givenName,
      email: profile.emails[0].value,
      password: profile.id 
    });
    return user || null;
  }
}
