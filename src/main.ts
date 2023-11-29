import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as express from "express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: "*", credentials: true },
  });

  app.setGlobalPrefix("api");
  app.use(express.static(join(__dirname, "..", "uploads")));
 
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(4000);
}

bootstrap();
