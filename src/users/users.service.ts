import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RoleEnum } from '../shared/enums/role.enum';
import { PasswordUtil } from '../shared/utils/password.util';
@Injectable()
export class UsersService implements OnModuleInit {
  private logger = new Logger(UsersService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async onModuleInit() {
    await this.ensureAdminUserExists();
  }

  private async ensureAdminUserExists() {
    const admin = this.configService.get<{
      username: string;
      password: string;
      email: string;
    }>('admin');

    const user = await this.findFirst({
      where: {
        username: {
          equals: admin.username,
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
        username: admin.username,
        password: await PasswordUtil.hash(admin.password),
        email: admin.email,
        isActive: true,
        createdBy: 'system',
        updatedBy: 'system',
        user2role: {
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

  async findUnique(args: Prisma.UserFindUniqueArgs) {
    return await this.prismaService.user.findUnique(args);
  }

  async findFirst(args: Prisma.UserFindFirstArgs) {
    return await this.prismaService.user.findFirst(args);
  }

  async create(args: Prisma.UserCreateArgs) {
    try {
      return await this.prismaService.user.create(args);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async update(args: Prisma.UserUpdateArgs) {
    try {
      return await this.prismaService.user.update(args);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
