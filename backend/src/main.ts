import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonLogger } from './common/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const logger = app.get(WinstonLogger);

  const allowedOrigins = configService.get<string>(
    'CORS_ORIGINS',
    'http://localhost:3000',
  );
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.split(',').includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200,
  });

  app.enableShutdownHooks();

  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT', 3000);

  try {
    await app.listen(port);
    const appUrl = await app.getUrl();
    logger.log(`Application is running on: ${appUrl}`);
  } catch (error) {
    logger.error('Error starting the server', error);
    process.exit(1);
  }

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
