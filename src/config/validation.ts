import * as Joi from 'joi';
import { EnvironmentEnum } from '../shared/enums/environment.enum';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(
      EnvironmentEnum.Development,
      EnvironmentEnum.Production,
      EnvironmentEnum.Test,
    )
    .required(),
  PORT: Joi.number().default(3000),
  GLOBAL_PREFIX: Joi.string().default(''),
  ADMIN_EMAIL: Joi.string().email().required(),
  ADMIN_PASSWORD: Joi.string().required(),
  JWT_IGNORE_EXPIRATION: Joi.boolean().default(false),
  JWT_ACCESS_SECRET_KEY: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d').valid('1d', '7d', '14d', '30d'),
});
