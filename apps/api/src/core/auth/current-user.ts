export type UserRole = "professor" | "aluna";

export interface CurrentUser {
  authUserId: string;
  email: string;
  role: UserRole;
  professorId?: string;
  alunaId?: string;
}
