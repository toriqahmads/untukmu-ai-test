import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ContextInterceptor } from './interceptors/context.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { HttpExceptionFilter } from './exception.filters/http.exception.filter';
import { AllExceptionsFilter } from './exception.filters/all.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(
    configService.get<string>('NODE_ENV') === 'prod' &&
      configService.get<boolean>('DEBUG', false) === false
      ? ['warn', 'error']
      : ['log', 'warn', 'error', 'debug', 'verbose'],
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalInterceptors(new ContextInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter());

  const docConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API Documentation')
    .setVersion('1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('api-docs', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(Number(configService.get<number>('PORT', 3000)));
}

bootstrap();
