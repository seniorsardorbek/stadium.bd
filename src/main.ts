import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as passport from "passport";
import { ValidationPipe } from "@nestjs/common";
import * as express from "express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: "*", credentials: true },
  });

  app.setGlobalPrefix("api");
  app.use(express.static(join(__dirname, "..", "uploads")));
  app.use(
    session({
      secret: "hey",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000 * 24,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(4000);
}

bootstrap();
