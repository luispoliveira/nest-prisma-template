import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvironmentEnum } from './shared/enums/environment.enum';
import { LoggerUtil } from './shared/utils/logger.util';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const environment = config.get<EnvironmentEnum>('environment');
  const port = config.get<number>('port');
  const globalPrefix = config.get<string>('globalPrefix');

  app.useLogger(LoggerUtil.getLogger(environment));

  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS/Prisma CMS Template')
    .setDescription('APIs fro NestJs/Prisma CMS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(`${globalPrefix}/api-docs`, app, swaggerDocument);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.setGlobalPrefix(globalPrefix);

  await app.listen(port, async () => {
    Logger.log(`Server running on http://localhost:${port}/${globalPrefix}`);
    Logger.log(`GraphQL at http://localhost:${port}/graphql`);
    Logger.log(`Environment: ${environment}`);
    Logger.log(`Running on: ${await app.getUrl()}`);
  });
}
bootstrap();
