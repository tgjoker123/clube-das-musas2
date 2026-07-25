import { Controller, Get, UseGuards } from "@nestjs/common";
import { SupabaseAuthGuard } from "./supabase-auth.guard";
import { CurrentUser } from "./current-user.decorator";
import type { CurrentUser as CurrentUserType } from "./current-user";

@Controller("auth")
export class AuthController {
  @Get("me")
  @UseGuards(SupabaseAuthGuard)
  me(@CurrentUser() user: CurrentUserType) {
    return user;
  }
}
