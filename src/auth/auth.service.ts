import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesService } from '../roles/roles.service';
import { User } from '../shared/__generated__/prisma-nestjs-graphql';
import { JwtPayloadType } from '../shared/types/jwt-payload.type';
import { PasswordUtil } from '../shared/utils/password.util';
import { TokenUtil } from '../shared/utils/token.util';
import { UsersService } from '../users/users.service';
import { LoginResponseInterface } from './interfaces/login-response.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
    private readonly rolesService: RolesService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findFirst({
      where: {
        email: email,
        isActive: true,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!(await PasswordUtil.compare(user.password, password)))
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(user: User): Promise<LoginResponseInterface> {
    const permissions = await this.usersService.getUserPermissions(user.id);
    const roles = await this.usersService.getUserRoles(user.id);

    const payload: JwtPayloadType = {
      userId: user.id,
      email: user.email,
      permissions,
      roles,
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
      email: user.email,
      permissions,
      roles: roles,
    };
  }

  async forgetPassword(email: string) {
    const user = await this.usersService.findFirst({
      where: { email: email },
    });

    if (!user) return true;

    await this.usersService.update({
      where: {
        id: user.id,
      },
      data: {
        isActive: false,
        password: null,
        resetPasswordToken: TokenUtil.generate(),
        resetPasswordExpires: TokenUtil.getExpirationDate(1),
        deactivatedAt: new Date(),
      },
    });

    /**
     * send email with reset password link
     */
    return true;
  }

  async recoverPassword(token: string, password: string) {
    const user = await this.usersService.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) return false;

    await this.usersService.update({
      where: {
        id: user.id,
      },
      data: {
        isActive: true,
        password: await PasswordUtil.hash(password),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        deactivatedAt: null,
        activatedAt: new Date(),
      },
    });

    return true;
  }

  async activateAccount(token: string, password: string) {
    const user = await this.usersService.findFirst({
      where: {
        activationToken: token,
        activationTokenExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) return false;

    await this.usersService.update({
      where: {
        id: user.id,
      },
      data: {
        isActive: true,
        password: await PasswordUtil.hash(password),
        activationToken: null,
        activationTokenExpires: null,
        activatedAt: new Date(),
      },
    });

    return true;
  }
}
