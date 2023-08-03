import { UseGuards } from '@nestjs/common';
import { ApiKeyAuthGuard } from '../guards/apikey-auth.guard';

@UseGuards(ApiKeyAuthGuard)
export class BaseApiKeyController {}
