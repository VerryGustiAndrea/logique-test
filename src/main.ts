import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '../images'), { prefix: '/images' });
  // app.useStaticAssets(join(__dirname, '../src/repository/pdf'), { prefix: '/pdf' });

  // if (process.env.ENABLE_CORS) {
  app.enableCors();
  // }
  if (process.env.SHOW_SWAGGER_API === 'true') {
    const options = new DocumentBuilder()
      .setTitle('Logique-Test API')
      .setDescription('Logique-Test API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }




  await app.listen(process.env.APP_PORT);
}
bootstrap();
