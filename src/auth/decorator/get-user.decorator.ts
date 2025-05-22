import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | string[] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (Array.isArray(data)) {
      return data.reduce((obj, key) => {
        obj[key] = request.user[key];
        return obj;
      }, {});
    }
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
