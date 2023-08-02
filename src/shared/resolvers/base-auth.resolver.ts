import { UseGuards, UseInterceptors } from '@nestjs/common';
import { LoggerInterceptor } from '../../logger/logger.interceptor';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@UseInterceptors(LoggerInterceptor)
@UseGuards(JwtAuthGuard)
export class BaseAuthResolver {}
