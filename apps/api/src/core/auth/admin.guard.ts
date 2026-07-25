import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import type { CurrentUser } from "./current-user";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: CurrentUser | undefined = request.user;
    return !!user?.isAdmin;
  }
}
