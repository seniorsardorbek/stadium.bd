import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";
import { ValidationPipe } from "@nestjs/common";
import * as express from "express";
import { join } from "path";
import config from "./shared/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: "*", credentials: true },
  });

  app.setGlobalPrefix("api");
  app.use(express.static(join(__dirname, "..", "uploads")));
  app.use(
    session({
      secret: config.jwt.secret,
      saveUninitialized: false, 
      resave: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    }),
  );
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(4000);
}

bootstrap();
