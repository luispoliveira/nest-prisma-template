import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppModule } from './app.module';
import { EnvironmentEnum } from './shared/enums/environment.enum';
import { LoggerUtil } from './shared/utils/logger.util';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const config = app.get(ConfigService);
  const environment = config.get<EnvironmentEnum>('environment');

  app.useLogger(LoggerUtil.getLogger(environment));

  try {
    await app.select(CommandModule).get(CommandService).exec();
    await app.close();
  } catch (e) {
    Logger.error(e);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
