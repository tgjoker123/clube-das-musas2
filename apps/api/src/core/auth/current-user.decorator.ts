import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { CurrentUser as CurrentUserType } from "./current-user";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserType => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
