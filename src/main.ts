import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Some project')
    .setDescription(
      'API documentation for some application. <br><br><a href="/swagger-json" target="_blank">Download JSON</a>',
    )
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Добавляем эндпоинт для скачивания JSON версии документации
  app.getHttpAdapter().get('/swagger-json', (req, res) => {
    res.type('application/json').send(document);
  });

  await app.listen(3000);
}

bootstrap();
