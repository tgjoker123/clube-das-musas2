import type { ThemeName, UserRole } from "../enums/index.ts";

/** Espelha ResolvedContext de apps/api/src/core/auth/auth.service.ts. */
export interface ResolvedContext {
  userId: string;
  authUserId: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: string;
  professorId?: string;
}

export interface RegisterProfessorInput {
  businessName: string;
  phone?: string;
  themePreference?: ThemeName;
}

export interface RegisterPartnerInput {
  businessName: string;
  category?: string;
}

export interface ActivateStudentInput {
  token: string;
}

export interface InvitePreview {
  studentFirstName: string;
  professorBusinessName: string;
  /** E-mail para onde o convite foi enviado — usado para criar a conta no Supabase Auth. */
  email: string;
}
