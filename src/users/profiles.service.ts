import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ProfilesService {
  private logger = new Logger(ProfilesService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async update(args: Prisma.ProfileUpdateArgs) {
    try {
      return await this.prismaService.profile.update(args);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
