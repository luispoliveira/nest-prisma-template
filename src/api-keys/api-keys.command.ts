import { Injectable, Logger } from '@nestjs/common';
import { Command, Option, Positional } from 'nestjs-command';
import { ApiKeyUtil } from '../shared/utils/api-key.util';
import { ApiKeysService } from './api-keys.service';

@Injectable()
export class ApiKeysCommand {
  private logger = new Logger(ApiKeysCommand.name);
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Command({
    command: 'apiKey:generate <name> <expiresAt>',
    describe: 'Generate an API key',
  })
  async createApiKey(
    @Positional({
      name: 'name',
      describe: 'Description Name',
      type: 'string',
    })
    name: string,
    @Option({
      name: 'expiresAt',
      describe: 'Expiration Date',
      type: 'string',
    })
    expiresAt: Date,
  ) {
    const randomApiKey = ApiKeyUtil.generateApiKey();

    const apiKey = await this.apiKeysService.create({
      data: {
        name,
        key: ApiKeyUtil.encode(randomApiKey),
        expiresAt: new Date(expiresAt),
      },
    });

    this.logger.log(`API Key: ${randomApiKey}`);
  }
}
