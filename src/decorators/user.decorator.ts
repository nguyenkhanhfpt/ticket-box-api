import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to get the user from the request object
 * @param data
 * @param ctx
 */
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
