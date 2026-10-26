import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('NautiFlow API')
    .setDescription(
      'Documentación oficial del back-office de agencias de lanchas',
    )
    .setVersion('1.0')
    .addTag('boat-operators')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
