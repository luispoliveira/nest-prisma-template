import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { ContextUtil } from '../shared/utils/context.util';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = ContextUtil.getRequest(context);

    const userAgent = request.get('user-agent') || '';
    const { ip, method, url, body, query, params } = request;

    const className = context.getClass().name;
    const handlerName = context.getHandler().name;

    const username = request.user?.username || 'anonymous';

    const log = await this.loggerService.create({
      data: {
        userAgent,
        ip,
        method,
        url,
        body,
        query,
        params,
        className,
        methodName: handlerName,
        username,
      },
    });

    return next.handle().pipe(
      tap(async (res) => {
        await this.loggerService.update({
          where: { id: log.id },
          data: { response: res },
        });
      }),
    );
  }
}
