import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../shared/__generated__/prisma-nestjs-graphql';

@Injectable()
export class RolesService {
  private logger = new Logger(RolesService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findMany(args: Prisma.RoleFindManyArgs): Promise<Role[]> {
    return await this.prismaService.role.findMany({
      ...args,
      include: {
        role2permission: {
          include: {
            permission: true,
          },
        },
      },
    });
  }
}
