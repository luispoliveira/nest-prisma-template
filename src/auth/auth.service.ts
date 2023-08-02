import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesService } from '../roles/roles.service';
import { User } from '../shared/__generated__/prisma-nestjs-graphql';
import { JwtPayloadType } from '../shared/types/jwt-payload.type';
import { PasswordUtil } from '../shared/utils/password.util';
import { UsersService } from '../users/users.service';
import { LoginResponseInterface } from './interfaces/login-response.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
    private readonly rolesService: RolesService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });

    if (!user) return null;

    if (await PasswordUtil.compare(user.password, password)) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(user: User): Promise<LoginResponseInterface> {
    const permissions = await this.permissionsService.findMany({
      where: {
        permission2user: {
          some: {
            userId: user.id,
            user: {
              isActive: true,
            },
          },
        },
      },
    });

    const roles = await this.rolesService.findMany({
      where: {
        role2user: {
          some: {
            userId: user.id,
            user: {
              isActive: true,
            },
          },
        },
      },
    });

    const mergedPermissions = [
      ...new Set([
        ...permissions.map((permission) => permission.name),
        ...roles
          .map((role) => role.role2permission)
          .flat()
          .map((role2permission) => role2permission.permission.name),
      ]),
    ];

    const payload: JwtPayloadType = {
      userId: user.id,
      username: user.username,
      permissions: mergedPermissions,
    };

    await this.usersService.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
      },
    });

    return {
      accessToken: this.jwtService.sign(payload),
      userId: user.id,
      username: user.username,
      permissions: mergedPermissions,
    };
  }

  async signUp(data: Prisma.UserCreateInput) {
    data.password = await PasswordUtil.hash(data.password);

    const user = await this.usersService.create({ data });
    const {
      password,
      resetPasswordExpires,
      resetPasswordToken,
      isActive,
      ...result
    } = user;
    return result;
  }

  async recoverPassword(email: string) {
    const user = await this.usersService.findUnique({
      where: { email: email },
    });

    if (!user) throw new NotFoundException('Email not found');
  }

  async resetPassword(resetToken: string, password: string) {
    const user = await this.usersService.findUnique({
      where: { resetPasswordToken: resetToken },
    });

    if (!user) throw new BadRequestException('Reset Token does not exist');

    if (user.resetPasswordExpires < new Date())
      throw new BadRequestException('Reset Token has expired');

    await this.usersService.update({
      where: { id: user.id },
      data: {
        password: await PasswordUtil.hash(password),
        resetPasswordExpires: null,
        resetPasswordToken: null,
      },
    });
  }
}
