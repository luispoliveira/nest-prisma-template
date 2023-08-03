import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiKeysService {
  private logger = new Logger(ApiKeysService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(args: Prisma.ApiKeyFindUniqueArgs) {
    return this.prismaService.apiKey.findUnique(args);
  }

  async create(args: Prisma.ApiKeyCreateArgs) {
    try {
      return await this.prismaService.apiKey.create(args);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
