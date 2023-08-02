import { LogLevel } from '@nestjs/common';
import { EnvironmentEnum } from '../enums/environment.enum';
export class LoggerUtil {
  static getLogger = (environment: EnvironmentEnum) => {
    const logger: LogLevel[] = ['error', 'warn'];

    switch (environment) {
      case EnvironmentEnum.Development:
        logger.push('log', 'debug', 'verbose');
        break;
      case EnvironmentEnum.Test:
        logger.push('log');
        break;
    }

    return logger;
  };
}
