import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('gb-demo-app')
    .setDescription('The API description gb-demo-app')
    .setVersion('1.0')
    .addTag('gb-demo-app')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.useStaticAssets('./public/');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
