import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  private logger = new Logger(PermissionsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findMany(args: Prisma.PermissionFindManyArgs) {
    return await this.prismaService.permission.findMany({
      ...args,
    });
  }

  async findUnique(args: Prisma.PermissionFindUniqueArgs) {
    return await this.prismaService.permission.findUnique(args);
  }
}
