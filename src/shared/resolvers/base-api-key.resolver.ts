import { UseGuards, UseInterceptors } from '@nestjs/common';
import { LoggerInterceptor } from '../../logger/logger.interceptor';
import { ApiKeyAuthGuard } from '../guards/apikey-auth.guard';

@UseInterceptors(LoggerInterceptor)
@UseGuards(ApiKeyAuthGuard)
export class BaseApiKeyResolver {}
