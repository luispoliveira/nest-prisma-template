import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../shared/__generated__/prisma-nestjs-graphql';

@Injectable()
export class RolesService {
  private logger = new Logger(RolesService.name);

  private defaultInclude: Prisma.RoleInclude = {
    Permissions2Roles: {
      include: {
        permission: true,
      },
    },
  };

  constructor(private readonly prismaService: PrismaService) {}

  async findMany(args: Prisma.RoleFindManyArgs): Promise<Role[]> {
    return await this.prismaService.role.findMany({
      ...args,
      include: {
        Permissions2Roles: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async findUnique(args: Prisma.RoleFindUniqueArgs): Promise<Role | null> {
    return await this.prismaService.role.findUnique({
      ...args,
      include: this.defaultInclude,
    });
  }

  async create(args: Prisma.RoleCreateArgs): Promise<Role> {
    try {
      return await this.prismaService.role.create(args);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async update(args: Prisma.RoleUpdateArgs): Promise<Role> {
    try {
      return await this.prismaService.role.update(args);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
