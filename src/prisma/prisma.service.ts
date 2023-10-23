import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
import { EnvironmentEnum } from '../shared/enums/environment.enum';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    const log: Prisma.LogLevel[] = ['warn', 'error'];

    switch (configService.get<EnvironmentEnum>('environment')) {
      case EnvironmentEnum.Development:
        log.push('info');
        log.push('query');
        break;
      case EnvironmentEnum.Test:
        log.push('info');
        break;
    }
    super({
      log: log,
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
