import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { ApiKeysService } from '../../api-keys/api-keys.service';
import { ApiKeyUtil } from '../../shared/utils/api-key.util';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor(private readonly apiKeysService: ApiKeysService) {
    super({ header: 'api-key', prefix: '' }, true, async (apikey, done) => {
      const apiKey = await this.apiKeysService.findUnique({
        where: { key: ApiKeyUtil.encode(apikey) },
      });

      if (!apiKey) return done(new UnauthorizedException(), null);

      if (!apiKey.isActive) return done(new UnauthorizedException(), null);

      const currentDate = new Date();

      if (apiKey.expiresAt < currentDate)
        return done(new UnauthorizedException(), null);

      done(null, true);
    });
  }
}
