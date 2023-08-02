import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class LoggerService {
  constructor(private readonly prismaService: PrismaService) {}

  private logger = new Logger(LoggerService.name);
  private blockedClassName = [];

  async create(data: Prisma.LogCreateArgs) {
    try {
      if (this.blockedClassName.includes(data.data.className))
        data.data.body = undefined;
      return await this.prismaService.log.create(data);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async update(data: Prisma.LogUpdateArgs) {
    try {
      if (this.blockedClassName.includes(data.data.className))
        data.data.response = undefined;

      return await this.prismaService.log.update(data);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
