import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategys/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const jwt = configService.get<{
          ignoreExpiration: boolean;
          access: string;
          expiresIn: string;
        }>('jwtSecretKey');
        return {
          secret: jwt.access,
          signOptions: {
            expiresIn: jwt.expiresIn,
          },
        };
      },
    }),
    UsersModule,
    PermissionsModule,
    RolesModule,
  ],
  providers: [JwtStrategy, AuthService, AuthResolver],
})
export class AuthModule {}
