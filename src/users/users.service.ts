import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RoleEnum } from '../shared/enums/role.enum';
import { PasswordUtil } from '../shared/utils/password.util';
@Injectable()
export class UsersService implements OnModuleInit {
  private logger = new Logger(UsersService.name);

  private defaultInclude: Prisma.UserInclude = {
    Roles2Users: {
      include: {
        role: {
          include: {
            Permissions2Roles: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    },
    Permissions2Users: {
      include: {
        permission: true,
      },
    },
  };

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.ensureAdminUserExists();
  }

  private async ensureAdminUserExists() {
    const admin = this.configService.get<{
      password: string;
      email: string;
    }>('admin');

    const user = await this.findFirst({
      where: {
        email: {
          equals: admin.email,
          mode: 'insensitive',
        },
      },
    });

    if (user) {
      this.logger.log(`Admin user already exists`);
      return;
    }

    await this.create({
      data: {
        password: await PasswordUtil.hash(admin.password),
        email: admin.email,
        isActive: true,
        createdBy: 'system',
        updatedBy: 'system',
        Profile: {
          create: {
            createdBy: 'system',
            updatedBy: 'system',
          },
        },
        Roles2Users: {
          create: {
            createdBy: 'system',
            updatedBy: 'system',
            role: {
              connect: {
                name: RoleEnum.Admin,
              },
            },
          },
        },
      },
    });

    this.logger.log(`Admin user created`);
  }

  async findMany(args: Prisma.UserFindManyArgs, include = this.defaultInclude) {
    return await this.prismaService.user.findMany({
      ...args,
      include,
    });
  }

  async findUnique(
    args: Prisma.UserFindUniqueArgs,
    include = this.defaultInclude,
  ) {
    return await this.prismaService.user.findUnique({
      ...args,
      include,
    });
  }

  async findFirst(
    args: Prisma.UserFindFirstArgs,
    include = this.defaultInclude,
  ) {
    return await this.prismaService.user.findFirst({
      ...args,
      include,
    });
  }

  async create(args: Prisma.UserCreateArgs, include = this.defaultInclude) {
    try {
      return await this.prismaService.user.create({
        ...args,
        include: include,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async update(args: Prisma.UserUpdateArgs, include = this.defaultInclude) {
    try {
      return await this.prismaService.user.update({
        ...args,
        include,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const roles = await this.prismaService.role.findMany({
      where: {
        isActive: true,
        Roles2Users: {
          some: {
            userId: userId,
            isActive: true,
          },
        },
      },
    });

    return roles.map((r) => r.name);
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    const allPermissions: string[] = [];

    const permissions = await this.prismaService.permission.findMany({
      where: {
        Permissions2Users: {
          some: {
            userId: userId,
            isActive: true,
          },
        },
      },
    });
    for (const permission of permissions) {
      if (!allPermissions.includes(permission.name))
        allPermissions.push(permission.name);
    }

    const roles = await this.prismaService.role.findMany({
      where: {
        isActive: true,
        Roles2Users: {
          some: {
            userId: userId,
            isActive: true,
          },
        },
      },
      include: {
        Permissions2Roles: {
          where: {
            isActive: true,
          },
          include: {
            permission: true,
          },
        },
      },
    });

    for (const role of roles) {
      const permissions2Roles = role.Permissions2Roles;
      for (const permission2Role of permissions2Roles) {
        if (!allPermissions.includes(permission2Role.permission.name))
          allPermissions.push(permission2Role.permission.name);
      }
    }

    return allPermissions;
  }
}
