import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserValidate } from '../types/user-validate.type';
import { ContextUtil } from '../utils/context.util';

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext): UserValidate => {
    data = data;
    const request = ContextUtil.getRequest(context);
    return request.user;
  },
);
