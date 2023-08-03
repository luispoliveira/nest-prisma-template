import { Module } from '@nestjs/common';
import { ApiKeyController } from './api-key.controller';
import { ApiKeysCommand } from './api-keys.command';
import { ApiKeysService } from './api-keys.service';

@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeysService, ApiKeysCommand],
  exports: [ApiKeysService],
})
export class ApiKeysModule {}
