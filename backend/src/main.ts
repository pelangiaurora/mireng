import {
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  // CORS
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Static uploads
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global interceptors
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(
      app.get(Reflector),
    ),
    new TransformInterceptor(),
  );

  // Global filters
  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Mireng Marketplace API')
    .setDescription(
      'Marketplace Digital API Documentation',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  SwaggerModule.setup(
    'api',
    app,
    document,
  );

  // Static uploads via Express
  app.use(
    '/uploads',
    express.static(
      join(__dirname, '..', 'uploads'),
    ),
  );

  await app.listen(3000);

  console.log(
    'Swagger running on: http://localhost:3000/api',
  );
}

bootstrap();