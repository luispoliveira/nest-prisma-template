import { UseGuards, UseInterceptors } from '@nestjs/common';
import { LoggerInterceptor } from '../../logger/logger.interceptor';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';

@UseInterceptors(LoggerInterceptor)
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BaseAuthResolver {}
