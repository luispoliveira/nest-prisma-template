import { Controller, Get } from '@nestjs/common';
import { BaseApiKeyController } from '../shared/controllers/base-api-key.controller';

@Controller('apiKey')
export class ApiKeyController extends BaseApiKeyController {
  @Get('hello')
  async hello() {
    return 'hello';
  }
}
