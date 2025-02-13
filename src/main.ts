import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ credentials: true });
  await app.listen(5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
