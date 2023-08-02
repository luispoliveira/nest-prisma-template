import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadType } from '../../shared/types/jwt-payload.type';
import { UserValidate } from '../../shared/types/user-validate.type';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwt = configService.get<{
      ignoreExpiration: boolean;
      access: string;
      expiresIn: string;
    }>('jwtSecretKey');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: jwt.ignoreExpiration,
      secretOrKey: jwt.access,
    });
  }
  async validate(payload: JwtPayloadType): Promise<UserValidate> {
    const { userId } = payload;

    const user = await this.usersService.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new UnauthorizedException();

    return {
      ...user,
    };
  }
}
