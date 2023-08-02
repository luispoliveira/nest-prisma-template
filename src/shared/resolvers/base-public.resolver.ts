import { UseInterceptors } from '@nestjs/common';
import { LoggerInterceptor } from '../../logger/logger.interceptor';
import { Public } from '../decorators/is-public.decorator';

@UseInterceptors(LoggerInterceptor)
@Public()
export class BasePublicResolver {}
